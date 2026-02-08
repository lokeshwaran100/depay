
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { chain } = await req.json()

        if (!chain || !["BASE-SEPOLIA", "ARC-TESTNET"].includes(chain)) {
            return NextResponse.json({ error: "Invalid chain selection" }, { status: 400 })
        }

        // Update user preference and mark onboarding as completed
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                preferredChain: chain,
                onboardingCompleted: true
            }
        })

        return NextResponse.json({ success: true, user: updatedUser })

    } catch (error) {
        console.error("Setup Error:", error)
        return NextResponse.json({ error: "Failed to complete setup" }, { status: 500 })
    }
}
