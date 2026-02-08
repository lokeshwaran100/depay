"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { MobileOnly } from "@/components/MobileOnly"

function ReviewContent() {
    const router = useRouter()
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const email = searchParams.get("email") || ""
    const amount = searchParams.get("amount") || "0.00"

    // @ts-ignore
    const network = session?.user?.preferredChain === "ARC-TESTNET" ? "Arc Testnet" : "Base Sepolia"


    const handleConfirm = async () => {
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, amount }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Transfer failed")
            }

            // Navigate to success page with transaction details
            router.push(`/send/success?email=${encodeURIComponent(email)}&amount=${amount}&txId=${data.transactionId || ""}`)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <MobileOnly>
            <div className="min-h-screen bg-[var(--depay-bg)] flex flex-col safe-top">
                {/* Header */}
                <header className="flex items-center px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-white hover:text-[var(--depay-text-secondary)] transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-bold text-white pr-8">Review Transfer</h1>
                </header>

                {/* Main Content */}
                <div className="flex-1 px-6 flex flex-col">
                    {/* Amount Display */}
                    <div className="flex flex-col items-center py-8">
                        <div className="w-16 h-16 rounded-full bg-[var(--depay-primary)]/20 flex items-center justify-center mb-4">
                            <span className="text-2xl text-[var(--depay-primary)]">$</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white">
                            ${parseFloat(amount).toFixed(2)} <span className="text-xl text-[var(--depay-text-secondary)]">USDC</span>
                        </h2>
                    </div>

                    {/* Transaction Details Card */}
                    <div className="bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-2xl p-5 space-y-4">
                        {/* Recipient */}
                        <div className="flex items-center justify-between pb-4 border-b border-[var(--depay-border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <span className="text-purple-400 font-semibold">{email[0]?.toUpperCase() || "R"}</span>
                                </div>
                                <span className="text-sm text-[var(--depay-text-secondary)] uppercase tracking-wider">Recipient</span>
                            </div>
                            <span className="text-sm text-white font-medium">{email}</span>
                        </div>

                        {/* Network */}
                        <div className="flex items-center justify-between pb-4 border-b border-[var(--depay-border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--depay-bg-secondary)] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[var(--depay-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="2" />
                                        <circle cx="12" cy="6" r="2" />
                                        <circle cx="12" cy="18" r="2" />
                                        <circle cx="6" cy="12" r="2" />
                                        <circle cx="18" cy="12" r="2" />
                                    </svg>
                                </div>
                                <span className="text-sm text-[var(--depay-text-secondary)] uppercase tracking-wider">Network</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--depay-primary)]" />
                                <span className="text-sm text-white font-medium">{network}</span>
                            </div>
                        </div>

                        {/* Network Fee */}
                        <div className="flex items-center justify-between pb-4 border-b border-[var(--depay-border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--depay-bg-secondary)] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[var(--depay-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-[var(--depay-text-secondary)] uppercase tracking-wider">Network Fee</span>
                            </div>
                            <span className="px-3 py-1 bg-[var(--depay-success)]/10 border border-[var(--depay-success)]/30 rounded-md text-[var(--depay-success)] text-sm font-medium">
                                Free
                            </span>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-base font-semibold text-white">Total to Pay</span>
                            <div className="text-right">
                                <p className="text-xl font-bold text-white">${parseFloat(amount).toFixed(2)} USDC</p>
                                <p className="text-xs text-[var(--depay-text-muted)]">≈ ${parseFloat(amount).toFixed(2)} USD</p>
                            </div>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 py-6">
                        <svg className="w-4 h-4 text-[var(--depay-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm text-[var(--depay-text-muted)]">End-to-end encrypted transaction</span>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-[var(--depay-error)] text-center mb-4">{error}</p>
                    )}
                </div>

                {/* Bottom Buttons */}
                <div className="px-6 pb-6 space-y-3 safe-bottom">
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Confirm & Send
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => router.back()}
                        disabled={loading}
                        className="w-full text-center text-[var(--depay-text-secondary)] hover:text-white py-3 font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </MobileOnly>
    )
}

export default function ReviewPage() {
    return (
        <Suspense fallback={
            <MobileOnly>
                <div className="min-h-screen bg-[var(--depay-bg)] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--depay-primary)]" />
                </div>
            </MobileOnly>
        }>
            <ReviewContent />
        </Suspense>
    )
}
