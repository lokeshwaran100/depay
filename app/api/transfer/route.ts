import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createTransfer } from "@/lib/circle"
import { depositToGateway, withdrawFromGateway } from "@/lib/gateway"
import { NextResponse } from "next/server"
import { sendEmail, paymentReceivedEmail, paymentSentEmail } from "@/lib/email"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { email, amount } = await req.json()

        if (!email || !amount) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        if (email === session.user.email) {
            return NextResponse.json({ error: "Cannot send to yourself" }, { status: 400 })
        }

        // 1. Find Recipient (and their wallets)
        const recipient = await prisma.user.findUnique({
            where: { email },
            include: { wallets: true },
        })

        if (!recipient || !recipient.wallets || recipient.wallets.length === 0) {
            return NextResponse.json(
                { error: "Recipient not found or has no wallet linked." },
                { status: 404 }
            )
        }

        // 2. Get Sender (and their wallets)
        const sender = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wallets: true },
        })

        if (!sender?.wallets || sender.wallets.length === 0) {
            return NextResponse.json({ error: "Sender wallet not found" }, { status: 400 })
        }

        // 3. Determine Chains
        const senderChain = sender.preferredChain || "BASE-SEPOLIA";
        const recipientChain = recipient.preferredChain || "BASE-SEPOLIA";

        // Find relevant wallets
        const senderWallet = sender.wallets.find(w => w.blockchain === senderChain) || sender.wallets[0];
        const recipientWallet = recipient.wallets.find(w => w.blockchain === recipientChain) || recipient.wallets[0];

        if (!senderWallet) throw new Error("Sender wallet not found for preferred chain");
        if (!recipientWallet) throw new Error("Recipient wallet not found for preferred chain");

        // 4. Calculate actual source/dest chains (in case fallback was used)
        const sourceChain = senderWallet.blockchain;
        const destChain = recipientWallet.blockchain;

        console.log(`[Transfer] Routing: ${sourceChain} -> ${destChain} | Amount: ${amount}`);

        let transferType = "SAME_CHAIN";
        let depositTxId = null;
        let withdrawTxId = null;
        let mainTxId = null;

        if (sourceChain === destChain) {
            // SAME CHAIN TRANSFER
            try {
                const tx = await createTransfer(
                    senderWallet.circleWalletId,
                    recipientWallet.address,
                    amount
                );
                mainTxId = tx?.id;
                console.log(`[Transfer] Same-chain tx sent: ${mainTxId}`);
            } catch (err: any) {
                console.error("Same-chain transfer failed:", err?.response?.data || err);
                return NextResponse.json({ error: "Transfer failed on chain" }, { status: 500 });
            }

        } else {
            // CROSS CHAIN TRANSFER (Gateway)
            transferType = "CROSS_CHAIN";
            try {
                // Step A: Deposit to Gateway (Source Chain)
                // Note: Type cast sourceChain to SupportedChain if needed by TS
                const depositRes = await depositToGateway(
                    senderWallet.circleWalletId,
                    amount,
                    sourceChain as any
                );
                depositTxId = depositRes.depositTxId;

                // Step B: Withdraw from Gateway (Dest Chain)
                // Note: In production, verify deposit first!
                const withdrawRes = await withdrawFromGateway(
                    amount,
                    recipientWallet.address,
                    destChain as any
                );
                withdrawTxId = withdrawRes.withdrawTxId;

                // Use withdraw ID as the main ID for tracking usually, or compound
                mainTxId = withdrawTxId;

            } catch (err: any) {
                console.error("Cross-chain transfer failed:", err);

                // If deposit failed (no txId), then funds are safe.
                if (!depositTxId) {
                    const errorMessage = err?.response?.data?.message || err?.message || "Transfer failed"
                    throw new Error(errorMessage) // Re-throw to be caught by outer catch
                }

                // If deposit succeeded but withdraw failed, we have a problem.
                return NextResponse.json({
                    error: "Cross-chain transfer failed. Funds may be in Gateway.",
                    details: { depositTxId, error: err.message }
                }, { status: 500 });
            }
        }

        // 5. Store Transaction Record
        await prisma.transaction.create({
            data: {
                senderId: sender.id,
                recipientEmail: email,
                amount: amount,
                status: "PENDING",
                transferType,
                sourceChain,
                destChain,
                depositTxHash: depositTxId,
                withdrawTxHash: withdrawTxId,
                txHash: mainTxId,
            },
        })

        // 6. Send Email Notifications
        try {
            // Notify recipient
            const receivedTemplate = paymentReceivedEmail(
                session.user.name || session.user.email || "Someone",
                amount
            )
            await sendEmail({
                to: email,
                subject: receivedTemplate.subject,
                html: receivedTemplate.html,
            })

            // Notify sender
            if (session.user.email) {
                const sentTemplate = paymentSentEmail(email, amount)
                await sendEmail({
                    to: session.user.email,
                    subject: sentTemplate.subject,
                    html: sentTemplate.html,
                })
            }
        } catch (emailError) {
            console.error("Failed to send notification emails:", emailError)
        }

        return NextResponse.json({
            success: true,
            txId: mainTxId,
            transferType
        })

    } catch (error: any) {
        console.error("Transfer Error:", error?.response?.data || error)
        const errorMessage = error?.response?.data?.message || error?.message || "Transfer failed"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

