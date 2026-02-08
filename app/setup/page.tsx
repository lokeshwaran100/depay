
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { MobileOnly } from "@/components/MobileOnly"

export default function SetupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [selectedChain, setSelectedChain] = useState<string | null>(null)
    const [error, setError] = useState("")

    const handleContinue = async () => {
        if (!selectedChain) {
            setError("Please select a network")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chain: selectedChain }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Setup failed")
            }

            // Redirect to dashboard
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <MobileOnly>
            <div className="min-h-screen bg-[var(--depay-bg)] flex flex-col p-6 safe-top safe-bottom">
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Choose your Network</h1>
                        <p className="text-[var(--depay-text-secondary)]">
                            Select which blockchain you want to use for your primary transactions.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Base Sepolia Option */}
                        <button
                            onClick={() => setSelectedChain("BASE-SEPOLIA")}
                            className={`w-full flex items-center p-4 rounded-2xl border transition-all ${selectedChain === "BASE-SEPOLIA"
                                    ? "bg-[var(--depay-primary)]/10 border-[var(--depay-primary)]"
                                    : "bg-[var(--depay-bg-card)] border-[var(--depay-border)] hover:border-[var(--depay-text-secondary)]"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${selectedChain === "BASE-SEPOLIA" ? "border-[var(--depay-primary)]" : "border-[var(--depay-text-muted)]"
                                }`}>
                                {selectedChain === "BASE-SEPOLIA" && <div className="w-3 h-3 rounded-full bg-[var(--depay-primary)]" />}
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-semibold">Base Sepolia</h3>
                                <p className="text-xs text-[var(--depay-text-secondary)]">Fast, low-cost triggers on Base L2</p>
                            </div>
                        </button>

                        {/* Arc Testnet Option */}
                        <button
                            onClick={() => setSelectedChain("ARC-TESTNET")}
                            className={`w-full flex items-center p-4 rounded-2xl border transition-all ${selectedChain === "ARC-TESTNET"
                                    ? "bg-[var(--depay-primary)]/10 border-[var(--depay-primary)]"
                                    : "bg-[var(--depay-bg-card)] border-[var(--depay-border)] hover:border-[var(--depay-text-secondary)]"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${selectedChain === "ARC-TESTNET" ? "border-[var(--depay-primary)]" : "border-[var(--depay-text-muted)]"
                                }`}>
                                {selectedChain === "ARC-TESTNET" && <div className="w-3 h-3 rounded-full bg-[var(--depay-primary)]" />}
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-semibold">Arc Testnet</h3>
                                <p className="text-xs text-[var(--depay-text-secondary)]">Architecture specific test network</p>
                            </div>
                        </button>
                    </div>

                    {error && (
                        <p className="text-sm text-[var(--depay-error)] text-center mt-6">{error}</p>
                    )}
                </div>

                <button
                    onClick={handleContinue}
                    disabled={loading || !selectedChain}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 mt-8"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Setting up...
                        </>
                    ) : (
                        "Continue to Dashboard"
                    )}
                </button>
            </div>
        </MobileOnly>
    )
}
