import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { sendEmail, inviteUserEmail } from "@/lib/email"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { email, amount } = await req.json()

        if (!email || !amount) {
            return NextResponse.json({ error: "Email and amount required" }, { status: 400 })
        }

        const senderName = session.user.name || session.user.email || "Someone"
        const inviteLink = `${process.env.NEXTAUTH_URL}/login`

        const template = inviteUserEmail(senderName, amount, inviteLink)

        await sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
        })

        return NextResponse.json({ success: true, message: "Invitation sent" })
    } catch (error) {
        console.error("Invite error:", error)
        return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
    }
}
