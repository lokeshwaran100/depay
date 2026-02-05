import Link from "next/link"
import { DePayLogo } from "@/components/MobileOnly"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[var(--depay-bg)] text-white">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-[var(--depay-border)] bg-[var(--depay-bg)]/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-2">
                        <DePayLogo size={32} />
                        <span className="text-xl font-bold">DePay</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-[var(--depay-text-secondary)] hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm text-[var(--depay-text-secondary)] hover:text-white transition-colors">How it works</a>
                        <a href="#security" className="text-sm text-[var(--depay-text-secondary)] hover:text-white transition-colors">Security</a>
                        <a href="#pricing" className="text-sm text-[var(--depay-text-secondary)] hover:text-white transition-colors">Pricing</a>
                    </div>

                    <Link
                        href="/login"
                        className="bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-16 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Send crypto like{" "}
                                <span className="text-gradient">email</span>
                            </h1>
                            <p className="text-lg text-[var(--depay-text-secondary)] max-w-lg">
                                The easiest way to send and receive crypto payments. No complicated wallet addresses, no hex codes, just an email address.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/login"
                                    className="bg-[var(--depay-primary)] hover:bg-[var(--depay-primary-hover)] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 text-center"
                                >
                                    Get Started Now
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="border border-[var(--depay-border)] hover:bg-[var(--depay-bg-card)] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 text-center"
                                >
                                    View Demo
                                </a>
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-[var(--depay-bg-card)] border-2 border-[var(--depay-bg)] flex items-center justify-center text-xs font-semibold">
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm text-[var(--depay-text-secondary)]">Trusted by 10,000+ early adopters</span>
                            </div>
                        </div>

                        {/* Demo Preview Card */}
                        <div className="relative">
                            <div className="bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-3xl p-6 max-w-sm mx-auto lg:ml-auto">
                                <div className="space-y-4">
                                    <div className="h-4 bg-[var(--depay-bg-secondary)] rounded-full w-24" />
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-[var(--depay-bg-secondary)] rounded-xl">
                                            <div className="w-6 h-6 rounded-full bg-[var(--depay-text-muted)]/20 flex items-center justify-center">
                                                <span className="text-xs">@</span>
                                            </div>
                                            <span className="text-sm text-[var(--depay-text-secondary)]">alex@design.com</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-[var(--depay-bg-secondary)] rounded-xl">
                                            <div className="w-6 h-6 rounded-full bg-[var(--depay-primary)]/20 flex items-center justify-center">
                                                <span className="text-xs text-[var(--depay-primary)]">$</span>
                                            </div>
                                            <span className="text-sm">0.5 ETH</span>
                                        </div>
                                    </div>
                                    <button className="w-full bg-[var(--depay-primary)] text-white py-3 rounded-xl font-semibold text-sm">
                                        Confirm Transaction
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-16 md:py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-[var(--depay-primary)] font-semibold text-sm uppercase tracking-wider mb-3">Process</p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-[var(--depay-text-secondary)] max-w-2xl mx-auto">
                            Experience the future of payments in three seamlessly integrated steps. We handle the complexity under the hood.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: "🔗",
                                title: "Connect Wallet",
                                description: "Securely link your preferred non-custodial wallet. We support MetaMask, Phantom, and WalletConnect."
                            },
                            {
                                icon: "✉️",
                                title: "Type Email",
                                description: "Enter the recipient's email address. No need to ask for long, error-prone public keys or QR codes."
                            },
                            {
                                icon: "➤",
                                title: "Send Funds",
                                description: "Confirm and send. The recipient receives a magic link to claim funds directly into their own wallet."
                            }
                        ].map((step, index) => (
                            <div key={index} className="bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-2xl p-6 hover:border-[var(--depay-primary)]/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-[var(--depay-primary)]/10 flex items-center justify-center text-2xl mb-4">
                                    {step.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-[var(--depay-text-secondary)]">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section id="features" className="py-16 md:py-24 bg-[var(--depay-bg-secondary)]/30">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-[var(--depay-primary)] font-semibold text-sm uppercase tracking-wider mb-3">Benefits</p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DePay</h2>
                        <p className="text-[var(--depay-text-secondary)] max-w-2xl mx-auto">
                            Built for the modern web, bridging the gap between Web2 usability and Web3 power.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-2xl p-6">
                            <div className="w-10 h-10 rounded-lg bg-[var(--depay-success)]/10 flex items-center justify-center text-[var(--depay-success)] mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Wallet Hassles</h3>
                            <p className="text-sm text-[var(--depay-text-secondary)] mb-4">
                                Recipients don&apos;t need a wallet setup beforehand. They can create one easily during the claim process or connect an existing one. We remove the biggest friction point in crypto adoption.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-[var(--depay-success)]">
                                    <span>●</span> Onboarding in seconds
                                </li>
                                <li className="flex items-center gap-2 text-sm text-[var(--depay-success)]">
                                    <span>●</span> Non-custodial by default
                                </li>
                            </ul>
                        </div>

                        <div className="bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-2xl p-6">
                            <div className="w-10 h-10 rounded-lg bg-[var(--depay-primary)]/10 flex items-center justify-center text-[var(--depay-primary)] mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Gasless Experience</h3>
                            <p className="text-sm text-[var(--depay-text-secondary)] mb-4">
                                DePay handles the gas fees for the claiming transaction. Recipients get the exact amount you sent without needing ETH or MATIC for fees.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-[var(--depay-primary)]">
                                    <span>●</span> Relayer network powered
                                </li>
                                <li className="flex items-center gap-2 text-sm text-[var(--depay-primary)]">
                                    <span>●</span> Pay fees in stablecoins
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Built for every scenario</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { title: "Freelancers", desc: "Get paid globally without high remittance fees. Send invoices directly to client emails." },
                            { title: "DAOs", desc: "Distribute grants and payroll to contributors simply by knowing their email address." },
                            { title: "E-Commerce", desc: "Issue refunds or rewards to customers instantly without needing their wallet details." },
                            { title: "Friends & Family", desc: "Split bills or send gifts to family members who are new to crypto, stress-free." }
                        ].map((useCase, index) => (
                            <div key={index} className="p-4 border-l-2 border-[var(--depay-border)] hover:border-[var(--depay-primary)] transition-colors">
                                <h3 className="font-semibold mb-2">{useCase.title}</h3>
                                <p className="text-xs text-[var(--depay-text-secondary)]">{useCase.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security */}
            <section id="security" className="py-16 md:py-24 bg-[var(--depay-bg-secondary)]/30">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--depay-primary)]/10 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-[var(--depay-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Bank-Grade Security</h2>
                    <p className="text-[var(--depay-text-secondary)] max-w-2xl mx-auto mb-8">
                        We don&apos;t hold your funds. Our smart contracts are audited and verified. Your private keys never leave your device, and email verification ensures funds only go to the intended owner.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-4 py-2 bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-full text-sm">
                            🛡️ Audited by CertiK
                        </span>
                        <span className="px-4 py-2 bg-[var(--depay-bg-card)] border border-[var(--depay-border)] rounded-full text-sm">
                            🔐 AES-256 Encryption
                        </span>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="bg-[var(--depay-primary)] rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to simplify crypto payments?</h2>
                        <p className="text-white/80 mb-8 max-w-lg mx-auto">
                            Join thousands of users sending crypto the easy way. No credit card required.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block bg-white text-[var(--depay-primary)] px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--depay-border)] py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <DePayLogo size={24} />
                                <span className="font-bold">DePay</span>
                            </div>
                            <p className="text-xs text-[var(--depay-text-secondary)]">
                                Making crypto payments as easy as sending an email. Secure, fast, and user-friendly.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-[var(--depay-text-secondary)]">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-[var(--depay-text-secondary)]">
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-[var(--depay-text-secondary)]">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-[var(--depay-border)] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-[var(--depay-text-secondary)]">
                            © 2023 DePay Inc. All rights reserved.
                        </p>
                        <div className="flex gap-4 text-[var(--depay-text-secondary)]">
                            <a href="#" className="hover:text-white transition-colors text-sm">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors text-sm">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors text-sm">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
