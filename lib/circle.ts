import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets"

const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
})

export const circle = client

export async function createWalletForUser(userId: string) {
    try {
        // 1. Create a Wallet Set for the user
        // In a real app, you might use a single Wallet Set for all users or one per user.
        // We'll create one per user for clear isolation.
        const walletSetRes = await client.createWalletSet({
            name: `User ${userId} Set`,
        })

        if (!walletSetRes.data?.walletSet?.id) {
            throw new Error("Failed to create Wallet Set")
        }

        const walletSetId = walletSetRes.data.walletSet.id

        // 2. Create a Wallet in the Set
        // Using BASE-SEPOLIA (Testnet) as per robust development practice
        const walletsRes = await client.createWallets({
            blockchains: ["BASE-SEPOLIA"],
            // Retrying with 'MATIC-AMOY' or 'ETH-SEPOLIA' is safer for defaults. 
            // PRD asked for Base. The string is likely "BASE-SEPOLIA".
            count: 1,
            walletSetId: walletSetId,
        })

        if (!walletsRes.data?.wallets || walletsRes.data.wallets.length === 0) {
            throw new Error("Failed to create Wallet")
        }

        return walletsRes.data.wallets[0]
    } catch (error) {
        console.error("Circle Create Wallet Error:", error)
        throw error
    }
}

export async function getWalletBalance(walletId: string) {
    const response = await client.getWalletTokenBalance({
        id: walletId,
        // Optional: filter by token?
    })
    return response.data?.tokenBalances || []
}

export async function createTransfer(
    walletId: string,
    destinationAddress: string,
    amount: string, // Amount in units (e.g. "1.5")
    tokenAddress: string = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // Default to Base Sepolia USDC
) {
    const response = await client.createTransaction({
        walletId,
        tokenAddress,
        blockchain: "BASE-SEPOLIA" as any, // Cast to any to avoid Enum/Union complexity issues for now
        destinationAddress,
        amount: [amount], // Reverting to 'amount' as per lint
        fee: { type: "level", config: { feeLevel: "MEDIUM" } }, // Optional
    })
    return response.data
}
