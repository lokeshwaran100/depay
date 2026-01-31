"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader className="text-center">
                    <CardTitle>Welcome to DePay</CardTitle>
                    <CardDescription>
                        Crypto payments as easy as email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        className="w-full"
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
