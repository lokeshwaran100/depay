import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getWalletBalance, createWalletForUser } from "@/lib/circle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import TransactionsList from "@/components/TransactionsList"
import { revalidatePath } from "next/cache"

import { DepositModal } from "@/components/DepositModal"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wallet: true },
  })

  if (!user || !user.wallet) {
    // Attempt auto-recovery
    if (user && !user.wallet) {
      try {
        console.log("Attempting to provision missing wallet for:", user.email)
        const wallet = await createWalletForUser(user.id)

        await prisma.wallet.create({
          data: {
            userId: user.id,
            circleWalletId: wallet.id,
            address: wallet.address || "",
          },
        })

        // Refresh the page
        revalidatePath("/")
        redirect("/")
      } catch (error) {
        console.error("Auto-provisioning failed:", error)
        return (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-500">Setup Failed</h1>
            <p className="text-muted-foreground">
              We could not create a wallet for you. Please check console logs.
            </p>
          </div>
        )
      }
    }

    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Setting up your wallet...</h1>
        <p className="text-muted-foreground">Please refresh in a few seconds.</p>
      </div>
    )
  }

  let balance = "0"
  try {
    const balances = await getWalletBalance(user.wallet.circleWalletId)
    console.log("user.wallet:", user.wallet)
    // Find USDC balance. Assuming USDC has a known symbol or is the main token.
    // For now, take the first token or look for "USDC"
    const usdc = balances.find((b: any) => b.token.symbol === "USDC")
    balance = usdc ? usdc.amount : "0.00"
  } catch (error) {
    console.error("Failed to fetch balance", error)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <DepositModal address={user.wallet.address} />
          <Button asChild>
            <Link href="/send">Send Money</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USDC Balance</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance}</div>
            <p className="text-xs text-muted-foreground">
              Base Sepolia Network
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <TransactionsList />
      </div>
    </div>
  )
}
