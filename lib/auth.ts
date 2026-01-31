import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { createWalletForUser } from "@/lib/circle"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
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
        async session({ session, token }) {
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.id = token.sub
            }
            return session
        },
    },
    events: {
        async createUser({ user }) {
            try {
                const wallet = await createWalletForUser(user.id)
                await prisma.wallet.create({
                    data: {
                        userId: user.id,
                        circleWalletId: wallet.id,
                        address: wallet.address || "",
                    },
                })
                console.log("Wallet created for user:", user.email)
            } catch (error) {
                console.error("Failed to provision wallet:", error)
            }
        },
    },
    pages: {
        signIn: "/login",
    },
}
