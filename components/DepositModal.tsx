"use client"

import { useState } from "react"
import QRCode from "react-qr-code"
import { Copy, Check, ArrowLeft } from "lucide-react"

interface DepositModalProps {
    address: string
    chain: string
}

export function DepositModal({ address, chain }: DepositModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-3 bg-[var(--depay-bg-card)] hover:bg-[var(--depay-bg-secondary)] text-white py-4 px-6 rounded-2xl font-semibold border border-[var(--depay-border)] transition-all duration-200 active:scale-[0.98]"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Deposit
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 bg-[var(--depay-bg)] flex flex-col animate-fade-in">
            {/* Header */}
            <header className="flex items-center px-4 py-4">
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 -ml-2 text-white hover:text-[var(--depay-text-secondary)] transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-bold text-white pr-8">Deposit USDC</h1>
            </header>

            {/* Content */}
            <div className="flex-1 px-6 overflow-y-auto">
                <div className="flex flex-col items-center space-y-6 py-4">
                    {/* Network Badge */}
                    <div className="badge-network inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--depay-success)]" />
                        {chain === 'ARC-TESTNET' ? 'ARC TESTNET' : 'BASE SEPOLIA'}
                    </div>

                    {/* QR Code Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-lg">
                        <QRCode value={address} size={200} />
                        <p className="text-center text-gray-500 text-sm mt-4">Scan to pay</p>
                    </div>

                    {/* Wallet Address */}
                    <div className="w-full bg-[var(--depay-bg-card)] rounded-2xl p-5 border border-[var(--depay-border)]">
                        <p className="text-xs text-[var(--depay-text-muted)] uppercase tracking-wider text-center mb-3">
                            Unified Wallet Address
                        </p>
                        <p className="font-mono text-sm text-white text-center break-all leading-relaxed mb-4">
                            {address}
                        </p>
                        <button
                            onClick={copyToClipboard}
                            className="w-full flex items-center justify-center gap-2 bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Address
                                </>
                            )}
                        </button>
                    </div>

                    {/* Warning */}
                    {/* <div className="flex items-start gap-3 p-4 bg-[var(--depay-warning)]/10 border border-[var(--depay-warning)]/20 rounded-xl">
                        <span className="text-[var(--depay-warning)] text-lg">⚠️</span>
                        <p className="text-sm text-[var(--depay-text-secondary)]">
                            Send <span className="text-white font-semibold">USDC</span> via{" "}
                            <span className="text-white font-semibold">{chain === 'ARC-TESTNET' ? 'Arc Testnet' : 'Base Sepolia'}</span> to this address.
                            Sending other assets may result in permanent loss.
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
