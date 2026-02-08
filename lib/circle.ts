import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets"

const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
})

export const circle = client

export async function createWalletForUser(userId: string) {
    try {
        // 1. Create a Wallet Set for the user
        const walletSetRes = await client.createWalletSet({
            name: `User ${userId} Set`,
        })

        if (!walletSetRes.data?.walletSet?.id) {
            throw new Error("Failed to create Wallet Set")
        }

        const walletSetId = walletSetRes.data.walletSet.id

        // 2. Create Wallets on both chains
        // Using refId ensures we get the SAME address on both EVM chains
        const walletsRes = await client.createWallets({
            accountType: "SCA",
            blockchains: ["ARC-TESTNET", "BASE-SEPOLIA"],
            count: 1,
            walletSetId: walletSetId,
            metadata: [
                { refId: `user-${userId}` }
            ]
        })

        if (!walletsRes.data?.wallets || walletsRes.data.wallets.length === 0) {
            throw new Error("Failed to create Wallets")
        }

        return walletsRes.data.wallets
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
