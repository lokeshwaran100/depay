import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createTransfer } from "@/lib/circle"
import { NextResponse } from "next/server"

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

        // 1. Find Recipient
        const recipient = await prisma.user.findUnique({
            where: { email },
            include: { wallet: true },
        })

        if (!recipient || !recipient.wallet) {
            return NextResponse.json(
                { error: "Recipient not found or has no wallet linked." },
                { status: 404 }
            )
        }

        // 2. Get Sender Wallet
        const sender = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wallet: true },
        })

        if (!sender?.wallet) {
            return NextResponse.json({ error: "Sender wallet not found" }, { status: 400 })
        }

        // 3. Execute Transfer
        const tx = await createTransfer(
            sender.wallet.circleWalletId,
            recipient.wallet.address,
            amount
        )

        // 4. Log Transaction (Optimistic)
        // Note: Circle tx is async. We store the 'id' (Circle Transaction ID)
        await prisma.transaction.create({
            data: {
                senderId: sender.id,
                recipientEmail: email,
                amount: amount,
                status: "PENDING", // Circle state usually 'INITIATED'
                txHash: tx?.id, // Store Circle ID in txHash for now or add circleTxId field
            },
        })

        return NextResponse.json({ success: true, txId: tx?.id })
    } catch (error) {
        console.error("Transfer Error:", error)
        return NextResponse.json({ error: "Transfer failed" }, { status: 500 })
    }
}
