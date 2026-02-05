"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { DePayLogo } from "@/components/MobileOnly"

export function Navbar() {
    const { data: session } = useSession()
    const pathname = usePathname()

    // Don't show navbar on landing page, login, or any mobile app routes
    // Landing page has its own nav, app pages have their own headers
    const isLandingPage = pathname === "/" && !session
    const isLoginPage = pathname === "/login"
    const isAppPage = pathname === "/" || pathname.startsWith("/send") || pathname.startsWith("/deposit")

    // Hide navbar for landing, login, and all authenticated app pages (they have their own headers)
    if (isLandingPage || isLoginPage || (session && isAppPage)) {
        return null
    }

    // This navbar is now primarily for non-authenticated users on other pages
    return (
        <nav className="border-b border-[var(--depay-border)] bg-[var(--depay-bg)]">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <DePayLogo size={32} />
                    <span className="text-xl font-bold text-white">DePay</span>
                </Link>
                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                {session.user?.image && (
                                    <img
                                        src={session.user.image}
                                        alt={session.user?.name || ""}
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                                <span className="text-sm text-white hidden md:inline">{session.user?.name}</span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="text-sm text-[var(--depay-text-secondary)] hover:text-white transition-colors"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
