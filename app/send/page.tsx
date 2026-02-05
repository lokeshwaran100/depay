"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, UserPlus, Send as SendIcon } from "lucide-react"
import { MobileOnly } from "@/components/MobileOnly"

export default function SendPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [userExists, setUserExists] = useState<boolean | null>(null)
    const [checkingUser, setCheckingUser] = useState(false)
    const [inviteSuccess, setInviteSuccess] = useState(false)
    const [balance, setBalance] = useState("0.00")

    // Fetch balance
    useEffect(() => {
        fetch("/api/balance")
            .then((res) => res.json())
            .then((data) => {
                if (data.balance) setBalance(data.balance)
            })
            .catch(console.error)
    }, [])

    // Debounced user check
    const checkUser = useCallback(async (emailToCheck: string) => {
        if (!emailToCheck || !emailToCheck.includes("@")) {
            setUserExists(null)
            return
        }

        setCheckingUser(true)
        try {
            const res = await fetch("/api/check-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailToCheck }),
            })
            const data = await res.json()
            setUserExists(data.exists)
        } catch (err) {
            console.error("Failed to check user:", err)
        } finally {
            setCheckingUser(false)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            checkUser(email)
        }, 500)
        return () => clearTimeout(timer)
    }, [email, checkUser])

    const handleInvite = async () => {
        if (!email || !amount) {
            setError("Please enter email and amount")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, amount }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to send invitation")
            }

            setInviteSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()

        // Navigate to review page with transaction details
        router.push(`/send/review?email=${encodeURIComponent(email)}&amount=${amount}`)
    }

    const setQuickAmount = (percent: number) => {
        const balanceNum = parseFloat(balance)
        if (balanceNum > 0) {
            const newAmount = (balanceNum * percent / 100).toFixed(2)
            setAmount(newAmount)
        }
    }

    if (inviteSuccess) {
        return (
            <MobileOnly>
                <div className="min-h-screen bg-[var(--depay-bg)] flex flex-col items-center justify-center p-6">
                    <div className="text-center space-y-4 max-w-sm">
                        <div className="w-20 h-20 rounded-full bg-[var(--depay-primary)]/10 flex items-center justify-center mx-auto mb-2">
                            <span className="text-4xl">📧</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Invitation Sent!</h2>
                        <p className="text-[var(--depay-text-secondary)]">
                            We&apos;ve sent an invitation to <span className="text-white font-semibold">{email}</span> to join DePay.
                        </p>
                        <p className="text-sm text-[var(--depay-text-muted)]">
                            Once they sign up, you can send them ${amount} USDC.
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full mt-6 bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </MobileOnly>
        )
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
                    <h1 className="flex-1 text-center text-lg font-bold text-white pr-8">Send</h1>
                </header>

                {/* Main Content */}
                <form onSubmit={handleSend} className="flex-1 flex flex-col px-6">
                    {/* Email Input */}
                    <div className="space-y-2 mb-8">
                        <label className="text-sm text-[var(--depay-text-secondary)]">To</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--depay-text-muted)]">
                                <span className="text-lg">@</span>
                            </div>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 pl-11 pr-4 bg-transparent border border-[var(--depay-border)] rounded-xl text-white placeholder:text-[var(--depay-text-muted)] focus:border-[var(--depay-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depay-primary)]/20 transition-colors"
                                required
                            />
                        </div>
                        {checkingUser && (
                            <p className="text-xs text-[var(--depay-text-muted)]">Checking user...</p>
                        )}
                        {!checkingUser && userExists === false && email && (
                            <p className="text-xs text-[var(--depay-warning)]">
                                This user is not registered. You can send them an invitation.
                            </p>
                        )}
                        {!checkingUser && userExists === true && (
                            <p className="text-xs text-[var(--depay-success)]">✓ User found</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="flex-1 flex flex-col items-center">
                        <label className="text-sm text-[var(--depay-text-secondary)] mb-4">Amount</label>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-3xl text-[var(--depay-text-muted)]">$</span>
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9.]/g, "")
                                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                        setAmount(val)
                                    }
                                }}
                                className={`bg-transparent border-none outline-none text-center w-48 text-5xl font-bold ${amount ? "text-white" : "text-[var(--depay-text-muted)]"
                                    }`}
                                required
                            />
                        </div>

                        {/* Currency Selector */}
                        <button
                            type="button"
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-full text-white text-sm"
                        >
                            USDC
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Available Balance */}
                        <div className="mt-8 w-full bg-[var(--depay-bg-card)] border border-[var(--depay-border)] border-dashed rounded-xl p-4">
                            <div className="text-center mb-3">
                                <p className="text-sm text-[var(--depay-text-secondary)]">Available Balance</p>
                                <p className="text-lg font-semibold text-white flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[var(--depay-primary)] flex items-center justify-center text-xs">$</span>
                                    {balance} USDC
                                </p>
                            </div>
                            <div className="flex gap-2 justify-center">
                                {[25, 50].map((pct) => (
                                    <button
                                        key={pct}
                                        type="button"
                                        onClick={() => setQuickAmount(pct)}
                                        className="px-4 py-1.5 border border-[var(--depay-primary)]/50 text-[var(--depay-primary)] rounded-full text-sm hover:bg-[var(--depay-primary)]/10 transition-colors"
                                    >
                                        {pct}%
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setQuickAmount(100)}
                                    className="px-4 py-1.5 border border-[var(--depay-primary)]/50 text-[var(--depay-primary)] rounded-full text-sm hover:bg-[var(--depay-primary)]/10 transition-colors"
                                >
                                    Max
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-[var(--depay-error)] text-center mb-4">{error}</p>
                    )}

                    {/* Submit Button */}
                    <div className="py-6 safe-bottom">
                        {userExists === false ? (
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 bg-[var(--depay-bg-card)] hover:bg-[var(--depay-bg-secondary)] text-white py-4 px-6 rounded-2xl font-semibold border border-[var(--depay-border)] transition-all duration-200 disabled:opacity-50"
                                disabled={loading || !amount}
                                onClick={handleInvite}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending Invitation...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Invite User
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50"
                                disabled={loading || userExists === null || checkingUser}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </MobileOnly>
    )
}
