import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { circle } from "@/lib/circle"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get user's wallets
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wallets: true },
        })

        if (!user || !user.wallets || user.wallets.length === 0) {
            return NextResponse.json({ balance: "0.00" })
        }

        // Get wallet for preferred chain
        const preferredWallet = user.wallets.find(w => w.blockchain === user.preferredChain) || user.wallets[0]

        // Fetch balance from Circle
        const res = await circle.getWalletTokenBalance({ id: preferredWallet.circleWalletId })
        const tokenBalances = res?.data?.tokenBalances || []

        // Find USDC balance
        const usdcBalance = tokenBalances.find((balance: any) => balance.token?.symbol === "USDC")

        // Return balance in human-readable format
        const balance = usdcBalance?.amount || "0.00"

        return NextResponse.json({
            balance,
            chain: preferredWallet.blockchain
        })
    } catch (error) {
        console.error("Balance Error:", error)
        return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
    }
}

