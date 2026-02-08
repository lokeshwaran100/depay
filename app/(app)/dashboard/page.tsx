import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createWalletForUser, circle } from "@/lib/circle"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { MobileOnly, DePayLogo } from "@/components/MobileOnly"
import TransactionsList from "@/components/TransactionsList"
import { DepositModal } from "@/components/DepositModal"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { wallets: true },
    })

    if (user && !user.onboardingCompleted) {
        redirect("/setup")
    }

    if (!user || !user.wallets || user.wallets.length === 0) {
        // Attempt auto-recovery
        if (user && (!user.wallets || user.wallets.length === 0)) {
            try {
                console.log("Attempting to provision missing wallets for:", user.email)
                // New multi-chain wallet creation
                const wallets = await createWalletForUser(user.id)

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

                // Refresh the page
                revalidatePath("/dashboard")
                redirect("/dashboard")
            } catch (error) {
                console.error("Auto-provisioning failed:", error)
                return (
                    // ... existing error UI ...
                    <MobileOnly>
                        <div className="min-h-screen bg-[var(--depay-bg)] flex items-center justify-center p-6">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--depay-error)]/10 flex items-center justify-center mx-auto">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <h1 className="text-xl font-bold text-white">Setup Failed</h1>
                                <p className="text-[var(--depay-text-secondary)] text-sm">
                                    We could not create a wallet for you. Please try again later.
                                </p>
                            </div>
                        </div>
                    </MobileOnly>
                )
            }
        }

        return (
            <MobileOnly>
                <div className="min-h-screen bg-[var(--depay-bg)] flex items-center justify-center p-6">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--depay-primary)]/10 flex items-center justify-center mx-auto animate-pulse">
                            <DePayLogo size={32} />
                        </div>
                        <h1 className="text-xl font-bold text-white">Setting up your wallet...</h1>
                        <p className="text-[var(--depay-text-secondary)] text-sm">
                            Please refresh in a few seconds.
                        </p>
                    </div>
                </div>
            </MobileOnly>
        )
    }

    let balance = "0.00"
    let chain = user.preferredChain || "BASE-SEPOLIA"

    try {
        // Fetch balance for preferred chain only
        const preferredWallet = user.wallets.find(w => w.blockchain === user.preferredChain) || user.wallets[0]

        if (preferredWallet) {
            const res = await circle.getWalletTokenBalance({ id: preferredWallet.circleWalletId })
            const balances = res?.data?.tokenBalances || []
            const usdc = balances.find((t: any) => t.token.symbol === "USDC")
            balance = usdc ? parseFloat(usdc.amount).toFixed(2) : "0.00"
            chain = preferredWallet.blockchain
        }

    } catch (error) {
        console.error("Failed to fetch balance", error)
    }

    // Determine primary address to show (based on preferredChain)
    const primaryWallet = user.wallets.find(w => w.blockchain === user.preferredChain) || user.wallets[0]

    return (
        <MobileOnly>
            <div className="min-h-screen bg-[var(--depay-bg)] flex flex-col safe-top safe-bottom">
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                        <DePayLogo size={36} />
                        <span className="text-lg font-bold text-white">DePay</span>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--depay-bg-card)] border border-[var(--depay-border)]">
                        {session.user?.image ? (
                            <img
                                src={session.user.image}
                                alt={session.user?.name || "User"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                                {session.user?.name?.[0] || "U"}
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 px-4 space-y-6 pb-8">
                    {/* Balance Card */}
                    <div className="card-balance rounded-3xl p-6 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--depay-text-secondary)] mb-2">
                            Balance
                        </p>
                        <h2 className="text-4xl font-bold text-white mb-3">
                            ${balance} <span className="text-xl text-[var(--depay-text-secondary)]">USDC</span>
                        </h2>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/send"
                            className="w-full flex items-center justify-center gap-3 bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            Send Money
                        </Link>

                        <DepositModal address={primaryWallet.address} chain={chain} />
                    </div>

                    {/* Recent Transactions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                        <TransactionsList />
                    </div>
                </main>
            </div>
        </MobileOnly>
    )
}
