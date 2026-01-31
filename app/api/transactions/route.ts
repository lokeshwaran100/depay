import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { senderId: session.user.id },
                    { recipientEmail: session.user.email || "" },
                ],
            },
            include: {
                sender: { select: { email: true } },
            },
            orderBy: { createdAt: "desc" },
        })

        const formatted = transactions.map((tx) => ({
            ...tx,
            type: tx.senderId === session.user.id ? "SENT" : "RECEIVED",
        }))

        return NextResponse.json({ transactions: formatted })
    } catch (error) {
        console.error("Tx History Error:", error)
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
    }
}
