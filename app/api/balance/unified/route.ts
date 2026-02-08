
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getUnifiedBalance } from "@/lib/gateway"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Fetch all wallets for the user
        const wallets = await prisma.wallet.findMany({
            where: { userId: session.user.id },
            select: { circleWalletId: true, blockchain: true }
        })

        if (!wallets.length) {
            return NextResponse.json({ total: 0, breakdown: {} })
        }

        const walletIds = wallets.map(w => w.circleWalletId)

        // Calculate unified balance
        // We also want to map back to blockchain names for the breakdown
        const balanceData = await getUnifiedBalance(walletIds)

        // Enrich breakdown with blockchain info
        const enrichedBreakdown: Record<string, number> = {}

        wallets.forEach(w => {
            // balanceData.breakdown uses walletId as key
            const amount = balanceData.breakdown[w.circleWalletId] || 0
            enrichedBreakdown[w.blockchain] = amount
        })

        return NextResponse.json({
            total: balanceData.total,
            breakdown: enrichedBreakdown
        })

    } catch (error) {
        console.error("[API] Failed to fetch unified balance:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
