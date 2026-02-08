import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { createWalletForUser } from "@/lib/circle"
import { sendEmail, welcomeEmail } from "@/lib/email"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("Debug: signIn callback", { user, account, profile })
            return true
        },
        async jwt({ token, user, account }) {
            console.log("Debug: jwt callback", { token, user })
            if (account && user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            console.log("Debug: session callback", { session, token })
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.id = token.sub
                // @ts-ignore
                // Fetch preferredChain from DB if needed, or store in token during jwt callback
                // For now, let's assume it's available or we fetch it
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: { preferredChain: true }
                    })
                    // @ts-ignore
                    session.user.preferredChain = user?.preferredChain || "BASE-SEPOLIA"
                } catch (e) {
                    console.error("Debug: Failed to fetch user chain preference", e)
                }
            }
            return session
        },
    },
    events: {
        async createUser({ user }) {
            console.log("Debug: createUser event started", user)
            try {
                // Returns array of wallets [{ blockchain: "ARC-TESTNET", ... }, { blockchain: "BASE-SEPOLIA", ... }]
                const wallets = await createWalletForUser(user.id)
                console.log("Debug: wallets created from Circle", wallets)

                // Create Wallet records in DB for each chain
                // Note: Schema updated wallet relations to one-to-many
                await prisma.$transaction(
                    wallets.map((w: any) =>
                        prisma.wallet.create({
                            data: {
                                userId: user.id,
                                circleWalletId: w.id,
                                address: w.address || "",
                                blockchain: w.blockchain,
                            },
                        })
                    )
                )

                console.log(`Created ${wallets.length} wallets for user:`, user.email)

                // Send welcome email
                if (user.email) {
                    try {
                        const template = welcomeEmail(user.name || "there")
                        await sendEmail({
                            to: user.email,
                            subject: template.subject,
                            html: template.html,
                        })
                    } catch (emailError) {
                        console.error("Failed to send welcome email:", emailError)
                    }
                }
            } catch (error) {
                console.error("Failed to provision wallet:", error)
            }
        },
    },
    pages: {
        signIn: "/login",
    },
}
