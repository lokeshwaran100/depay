import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Navbar } from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DePay - Send Crypto Like Email",
  description: "The easiest way to send and receive crypto payments. No wallet addresses needed, just an email.",
  keywords: ["crypto", "payments", "USDC", "email", "wallet", "blockchain"],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "DePay - Send Crypto Like Email",
    description: "The easiest way to send and receive crypto payments. No wallet addresses needed, just an email.",
    images: [
      {
        url: '/cover.png',
        width: 1200,
        height: 630,
        alt: 'DePay - Send & Receive USDC via Email',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DePay - Send Crypto Like Email",
    description: "The easiest way to send and receive crypto payments. No wallet addresses needed, just an email.",
    images: ['/cover.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
