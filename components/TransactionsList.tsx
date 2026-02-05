"use client"

import { useEffect, useState } from "react"

interface Transaction {
    id: string
    type: "SENT" | "RECEIVED"
    amount: string
    recipientEmail?: string
    sender?: { email: string }
    createdAt: string
}

export default function TransactionsList() {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        fetch("/api/transactions")
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data.transactions || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error("Failed to load transactions", err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="bg-[var(--depay-bg-card)] rounded-2xl p-6 flex justify-center border border-[var(--depay-border)]">
                <div className="w-5 h-5 border-2 border-[var(--depay-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-[var(--depay-bg-card)] rounded-2xl p-8 text-center border border-[var(--depay-border)]">
                <div className="w-12 h-12 rounded-full bg-[var(--depay-bg-secondary)] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[var(--depay-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p className="text-[var(--depay-text-secondary)] text-sm">No transactions yet</p>
                <p className="text-[var(--depay-text-muted)] text-xs mt-1">Your transactions will appear here</p>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        } else if (diffDays === 1) {
            return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }
    }

    return (
        <div className="space-y-3">
            {transactions.map((tx) => (
                <div
                    key={tx.id}
                    className="bg-[var(--depay-bg-card)] rounded-2xl p-4 flex items-center gap-4 border border-[var(--depay-border)]"
                >
                    {/* Icon */}
                    <div className={tx.type === "SENT" ? "tx-icon-sent" : "tx-icon-received"}>
                        {tx.type === "SENT" ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                            </svg>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">
                            {tx.type === "SENT" ? tx.recipientEmail : tx.sender?.email}
                        </p>
                        <p className="text-xs text-[var(--depay-text-muted)]">
                            {formatDate(tx.createdAt)}
                        </p>
                    </div>

                    {/* Amount */}
                    <div className={`font-bold text-base ${tx.type === "SENT" ? "text-white" : "text-[var(--depay-success)]"}`}>
                        {tx.type === "SENT" ? "-" : "+"}${tx.amount}
                    </div>
                </div>
            ))}
        </div>
    )
}
