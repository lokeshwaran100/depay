"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Send, UserPlus } from "lucide-react"

export default function SendPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [userExists, setUserExists] = useState<boolean | null>(null)
    const [checkingUser, setCheckingUser] = useState(false)
    const [inviteSuccess, setInviteSuccess] = useState(false)

    // Debounced user check
    const checkUser = useCallback(async (emailToCheck: string) => {
        if (!emailToCheck || !emailToCheck.includes('@')) {
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

            router.push("/")
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (inviteSuccess) {
        return (
            <div className="flex justify-center">
                <Card className="w-[450px]">
                    <CardContent className="pt-6 text-center">
                        <div className="text-6xl mb-4">📧</div>
                        <h2 className="text-xl font-bold mb-2">Invitation Sent!</h2>
                        <p className="text-muted-foreground mb-4">
                            We&apos;ve sent an invitation to <strong>{email}</strong> to join DePay.
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            Once they sign up, you can send them ${amount} USDC.
                        </p>
                        <Button onClick={() => router.push("/")} className="w-full">
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex justify-center">
            <Card className="w-[450px]">
                <CardHeader>
                    <CardTitle>Send USDC</CardTitle>
                    <CardDescription>Send money to any DePay user via email</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSend} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Recipient Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="friend@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {checkingUser && (
                                <p className="text-xs text-muted-foreground">Checking user...</p>
                            )}
                            {!checkingUser && userExists === false && email && (
                                <p className="text-xs text-amber-600">
                                    This user is not registered. You can send them an invitation.
                                </p>
                            )}
                            {!checkingUser && userExists === true && (
                                <p className="text-xs text-green-600">✓ User found</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (USDC)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {userExists === false ? (
                            <Button
                                type="button"
                                className="w-full"
                                disabled={loading || !amount}
                                onClick={handleInvite}
                                variant="secondary"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Invitation...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Invite User
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || userExists === null || checkingUser}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Money
                                    </>
                                )}
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
