"use client"

import { useState } from "react"
import { Check, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type Chain = "ARC-TESTNET" | "BASE-SEPOLIA"

interface ChainSelectionProps {
    onSelect: (chain: Chain) => void
    loading?: boolean
}

export function ChainSelection({ onSelect, loading }: ChainSelectionProps) {
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null)

    const handleContinue = () => {
        if (selectedChain) {
            onSelect(selectedChain)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Choose Your Default Blockchain</CardTitle>
                <CardDescription>
                    Select where you'd like to hold your USDC. You can still send and receive from users on either chain.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div
                    className={cn(
                        "relative flex cursor-pointer flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all hover:bg-accent",
                        selectedChain === "ARC-TESTNET" && "border-primary bg-accent"
                    )}
                    onClick={() => setSelectedChain("ARC-TESTNET")}
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Arc Testnet</h3>
                        {selectedChain === "ARC-TESTNET" && (
                            <Check className="h-5 w-5 text-primary" />
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <ul className="grid gap-2">
                            <li className="flex items-center gap-2">
                                <span className="text-xl">⚡</span> Lightning-fast transactions
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-xl">🌐</span> Arc ecosystem integration
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-xl">💰</span> Low gas fees
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    className={cn(
                        "relative flex cursor-pointer flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all hover:bg-accent",
                        selectedChain === "BASE-SEPOLIA" && "border-primary bg-accent"
                    )}
                    onClick={() => setSelectedChain("BASE-SEPOLIA")}
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Base Sepolia</h3>
                        {selectedChain === "BASE-SEPOLIA" && (
                            <Check className="h-5 w-5 text-primary" />
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <ul className="grid gap-2">
                            <li className="flex items-center gap-2">
                                <span className="text-xl">🛡️</span> Ethereum security
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-xl">🔗</span> Coinbase ecosystem
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-xl">🌍</span> Wide adoption
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    onClick={handleContinue}
                    disabled={!selectedChain || loading}
                    className="w-full md:w-auto"
                >
                    {loading ? "Creating Wallets..." : "Continue"}
                </Button>
            </CardFooter>
        </Card>
    )
}
