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
        <div
            className={`flex items-center justify-center rounded-xl bg-[var(--depay-primary)] ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                width={size * 0.6}
                height={size * 0.6}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Cube/box icon representing blockchain */}
                <path
                    d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 12L21 7"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 12V22"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 12L3 7"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Dollar sign in center */}
                <circle cx="12" cy="10" r="3" fill="white" fillOpacity="0.3" />
            </svg>
        </div>
    )
}
