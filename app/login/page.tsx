"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { DePayLogo } from "@/components/MobileOnly"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[var(--depay-bg)] flex flex-col">
            {/* Header */}
            <header className="flex justify-center pt-8 pb-4">
                <span className="text-xl font-bold text-white">DePay</span>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-sm space-y-8">
                    {/* Logo Icon */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-[var(--depay-primary)] blur-3xl opacity-20 scale-150" />
                            <div className="relative w-24 h-24 rounded-full bg-[var(--depay-primary)]/20 flex items-center justify-center border border-[var(--depay-primary)]/30">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-[var(--depay-primary)]"
                                >
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M12.5 7H11v6l4.75 2.85.75-1.23-4-2.37V7z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M9 12l3-3 3 3-3 3-3-3z"
                                        fill="currentColor"
                                        fillOpacity="0.5"
                                    />
                                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    <path
                                        d="M16 8l-4 4-4-4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        fill="none"
                                    />
                                    <path
                                        d="M8 16l4-4 4 4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        fill="none"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Send Crypto like an Email
                            </h1>
                            <p className="text-[var(--depay-text-secondary)] text-sm px-4">
                                Instant USDC transfers using just an email address. No wallet addresses, no complexity.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Section */}
            <div className="px-6 pb-8 space-y-4 safe-bottom">
                {/* Google Sign In Button */}
                <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-4 px-6 rounded-2xl font-semibold transition-all duration-200 hover:bg-gray-100 active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </button>

                {/* Terms */}
                <p className="text-center text-xs text-[var(--depay-text-muted)]">
                    By continuing, you agree to our{" "}
                    <Link href="#" className="text-[var(--depay-text-secondary)] hover:text-white underline">
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[var(--depay-text-secondary)] hover:text-white underline">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
