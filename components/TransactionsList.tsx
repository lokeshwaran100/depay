"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function TransactionsList() {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<any[]>([])

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
            <Card>
                <CardContent className="p-6 flex justify-center text-muted-foreground">
                    <Loader2 className="animate-spin h-5 w-5" />
                </CardContent>
            </Card>
        )
    }

    if (transactions.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No transactions yet.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="divide-y">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-sm">
                                    {tx.type === "SENT" ? `To: ${tx.recipientEmail}` : `From: ${tx.sender.email}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(tx.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className={`font-bold ${tx.type === "SENT" ? "text-red-500" : "text-green-500"}`}>
                                {tx.type === "SENT" ? "-" : "+"}
                                ${tx.amount}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
