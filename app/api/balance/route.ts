import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getWalletBalance } from "@/lib/circle"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get user's wallet
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wallet: true },
        })

        if (!user?.wallet) {
            return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
        }

        // Fetch balance from Circle
        const tokenBalances = await getWalletBalance(user.wallet.circleWalletId)

        // Find USDC balance (on Base Sepolia, the token address is 0x036CbD53842c5426634e7929541eC2318f3dCF7e)
        const usdcBalance = tokenBalances.find(
            (balance) => balance.token?.symbol === "USDC"
        )

        // Return balance in human-readable format
        const balance = usdcBalance?.amount || "0.00"

        return NextResponse.json({ balance })
    } catch (error) {
        console.error("Balance Error:", error)
        return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
    }
}
