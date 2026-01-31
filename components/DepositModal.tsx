"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import QRCode from "react-qr-code"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface DepositModalProps {
    address: string
}

export function DepositModal({ address }: DepositModalProps) {
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

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Deposit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Deposit USDC</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                    <div className="bg-white p-4 rounded-lg">
                        <QRCode value={address} size={200} />
                    </div>
                    <div className="w-full space-y-2">
                        <p className="text-sm font-medium text-center text-muted-foreground">
                            Scan QR or copy address below
                        </p>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <div className="flexh-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors font-mono break-all items-center flex">
                                    {address}
                                </div>
                            </div>
                            <Button
                                type="button"
                                size="icon"
                                className="px-3"
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                                <span className="sr-only">Copy</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
