import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={`min-h-screen bg-[var(--depay-bg)] ${inter.className}`}>
            {children}
        </div>
    )
}
