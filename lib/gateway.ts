
import { circle } from "./circle";

// Constants
export const MEMO = "DePay Gateway Transfer";
// Use env var or fallback
export const GATEWAY_WALLET_ADDRESS = process.env.GATEWAY_WALLET_ADDRESS || "0x4010e722678c927604b57fd9306014f9f912bc05";

export const CHAIN_CONFIG = {
    "ARC-TESTNET": {
        usdc: "0x3600000000000000000000000000000000000000",
        chainName: "Arc Testnet",
        gatewayWalletId: process.env.GATEWAY_WALLET_ID_ARC,
    },
    "BASE-SEPOLIA": {
        usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        chainName: "Base Sepolia",
        gatewayWalletId: process.env.GATEWAY_WALLET_ID_BASE,
    }
} as const;

type SupportedChain = keyof typeof CHAIN_CONFIG;

// Helper to parse decimal string to BigInt units (6 decimals for USDC)
// Note: Circle createTransaction expects 'amounts' as string array of decimal strings (e.g. ["1.5"]), NOT minimal units.
// Using parseUSDC to convert to units is for Contract Execution. 
// For createTransaction (Transfer), we use the raw string.

/**
 * Deposit USDC into Circle Gateway from a specific wallet on a source chain.
 * In our Hub & Spoke model, this is simply a TRANSFER to the Gateway Address.
 */
export async function depositToGateway(
    walletId: string,
    amount: string,
    sourceChain: SupportedChain
) {
    console.log(`[Gateway] Initiating deposit (transfer) of ${amount} USDC from ${sourceChain} to Gateway...`);

    const usdcAddress = CHAIN_CONFIG[sourceChain].usdc;

    try {
        // Simple Transfer to Gateway EOA
        const txRes = await circle.createTransaction({
            walletId,
            tokenAddress: usdcAddress,
            destinationAddress: GATEWAY_WALLET_ADDRESS,
            amount: [amount],
            blockchain: sourceChain as any,
            fee: { type: "level", config: { feeLevel: "MEDIUM" } }
        });

        if (!txRes.data?.id) throw new Error("Failed to create deposit transaction");
        console.log(`[Gateway] Deposit (Transfer) Tx ID: ${txRes.data.id}`);

        return {
            depositTxId: txRes.data.id
        };

    } catch (error) {
        console.error("[Gateway] Deposit Failed:", error);
        throw error;
    }
}

/**
 * Withdraw USDC from Gateway to a destination address on a destination chain.
 * This executes a transfer FROM the Gateway Wallet ON the destination chain.
 */
export async function withdrawFromGateway(
    amount: string,
    destAddress: string,
    destChain: SupportedChain
) {
    console.log(`[Gateway] Initiating withdrawal of ${amount} USDC to ${destAddress} on ${destChain}...`);

    const config = CHAIN_CONFIG[destChain];
    const gatewayWalletId = config.gatewayWalletId;
    const usdcAddress = config.usdc;

    if (!gatewayWalletId) {
        throw new Error(`Gateway Wallet ID not configured for chain ${destChain}`);
    }

    try {
        const txRes = await circle.createTransaction({
            walletId: gatewayWalletId,
            tokenAddress: usdcAddress,
            destinationAddress: destAddress,
            amount: [amount],
            blockchain: destChain as any,
            fee: { type: "level", config: { feeLevel: "MEDIUM" } }
        });

        if (!txRes.data?.id) throw new Error("Failed to create withdrawal transaction");
        console.log(`[Gateway] Withdrawal Tx ID: ${txRes.data.id}`);

        return {
            withdrawTxId: txRes.data.id
        };

    } catch (error) {
        console.error("[Gateway] Withdrawal Failed:", error);
        throw error;
    }
}

/**
 * Get unified balance for a specific wallet set / user.
 * Sums up balances from all provided wallet IDs.
 */
export async function getUnifiedBalance(walletIds: string[]) {
    let total = 0;
    const breakdown: Record<string, number> = {};

    // Use Promise.all for parallelism
    await Promise.all(walletIds.map(async (id) => {
        try {
            const response = await circle.getWalletTokenBalance({ id });
            const balances = response?.data?.tokenBalances || [];

            // Find USDC
            const usdc = balances.find((t: any) => t.token.symbol === "USDC");
            const amount = usdc ? parseFloat(usdc.amount) : 0;

            total += amount;
            breakdown[id] = amount;
        } catch (err) {
            console.error(`Failed to fetch balance for wallet ${id}`, err);
            breakdown[id] = 0;
        }
    }));

    return { total, breakdown };
}
