"use client"

import { ReactNode } from "react"

interface MobileOnlyProps {
    children: ReactNode
}

export function MobileOnly({ children }: MobileOnlyProps) {
    return (
        <>
            {/* Desktop Warning */}
            <div className="desktop-warning">
                <div className="max-w-md space-y-4">
                    <div className="flex justify-center">
                        <DePayLogo size={64} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Mobile Experience Only</h1>
                    <p className="text-[var(--depay-text-secondary)]">
                        DePay is optimized for mobile devices. Please switch to a mobile screen to start using the app.
                    </p>
                    <p className="text-sm text-[var(--depay-text-muted)]">
                        Resize your browser window or access from a mobile device.
                    </p>
                </div>
            </div>

            {/* Mobile App Content */}
            <div className="mobile-only-app">
                {children}
            </div>
        </>
    )
}

interface DePayLogoProps {
    size?: number
    className?: string
}

export function DePayLogo({ size = 40, className = "" }: DePayLogoProps) {
    return (
        <img
            src="/logo.png"
            alt="DePay Logo"
            className={`object-contain ${className}`}
            style={{ width: size, height: size }}
        />
    )
}
