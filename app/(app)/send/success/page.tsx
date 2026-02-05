"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Check, Copy, Loader2, Share2 } from "lucide-react"
import { MobileOnly } from "@/components/MobileOnly"

function SuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [copied, setCopied] = useState(false)

    const email = searchParams.get("email") || ""
    const amount = searchParams.get("amount") || "0.00"
    const txId = searchParams.get("txId") || "0x123...456"

    const formattedDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }) + ", " + new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })

    const truncatedTxId = txId.length > 12
        ? `${txId.slice(0, 6)}...${txId.slice(-3)}`
        : txId

    const copyTxId = async () => {
        try {
            await navigator.clipboard.writeText(txId)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const shareReceipt = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "DePay Transaction Receipt",
                    text: `Sent $${amount} USDC to ${email}`,
                    url: window.location.href,
                })
            } catch (err) {
                console.error("Share failed:", err)
            }
        }
    }

    return (
        <MobileOnly>
            <div className="min-h-screen bg-[var(--depay-bg)] flex flex-col safe-top">
                {/* Header */}
                <header className="flex justify-center py-4">
                    <span className="text-lg font-bold text-white">DePay</span>
                </header>

                {/* Main Content */}
                <div className="flex-1 px-6 flex flex-col items-center">
                    {/* Success Icon */}
                    <div className="py-8 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--depay-primary)] flex items-center justify-center mb-6">
                            <Check className="w-10 h-10 text-white" strokeWidth={3} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Payment Sent</h1>
                        <p className="text-center text-[var(--depay-text-secondary)]">
                            Your ${parseFloat(amount).toFixed(2)} USDC has been sent to<br />
                            <span className="text-white">{email}</span>
                        </p>
                    </div>

                    {/* Transaction Receipt Card */}
                    <div className="w-full bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-2xl p-5 space-y-4">
                        <h3 className="text-xs uppercase tracking-wider text-[var(--depay-text-secondary)] font-semibold">
                            Transaction Receipt
                        </h3>

                        {/* Transaction ID */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--depay-text-secondary)]">Transaction ID</span>
                            <button
                                onClick={copyTxId}
                                className="flex items-center gap-2 text-sm text-white hover:text-[var(--depay-primary)] transition-colors"
                            >
                                {truncatedTxId}
                                {copied ? (
                                    <Check className="w-4 h-4 text-[var(--depay-success)]" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--depay-text-secondary)]">Date & Time</span>
                            <span className="text-sm text-white">{formattedDate}</span>
                        </div>

                        {/* Network */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--depay-text-secondary)]">Network</span>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--depay-bg-secondary)] rounded-lg">
                                <svg className="w-4 h-4 text-[var(--depay-primary)]" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="12" cy="6" r="2" />
                                    <circle cx="12" cy="18" r="2" />
                                    <circle cx="6" cy="12" r="2" />
                                    <circle cx="18" cy="12" r="2" />
                                </svg>
                                <span className="text-sm text-white">Base Sepolia</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-[var(--depay-border)]" />

                        {/* Total Amount */}
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-sm text-[var(--depay-text-secondary)]">Total Amount</span>
                            <span className="text-lg font-bold text-white">${parseFloat(amount).toFixed(2)} USDC</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="px-6 pb-6 space-y-3 safe-bottom">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200"
                    >
                        Done
                    </button>

                    <button
                        onClick={shareReceipt}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--depay-bg-card)] hover:bg-[var(--depay-bg-secondary)] text-white py-4 px-6 rounded-2xl font-semibold border border-[var(--depay-border)] transition-all duration-200"
                    >
                        <Share2 className="w-5 h-5" />
                        Share Receipt
                    </button>
                </div>
            </div>
        </MobileOnly>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <MobileOnly>
                <div className="min-h-screen bg-[var(--depay-bg)] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--depay-primary)]" />
                </div>
            </MobileOnly>
        }>
            <SuccessContent />
        </Suspense>
    )
}
