import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true }
        })

        return NextResponse.json({
            exists: !!user,
            email
        })
    } catch (error) {
        console.error("Check user error:", error)
        return NextResponse.json({ error: "Failed to check user" }, { status: 500 })
    }
}
