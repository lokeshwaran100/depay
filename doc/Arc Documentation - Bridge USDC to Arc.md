# Bridge USDC to Arc - Arc Docs

> Learn how to bridge USDC to Arc via CCTP with Bridge Kit

Source: https://docs.arc.network/arc/tutorials/bridge-usdc-to-arc

Cross-Chain Transfer Protocol
(CCTP) is a
permissionless onchain utility that facilitates USDC transfers securely
between supported blockchains via native burning and minting. For more info,
visit the [CCTP](https://developers.circle.com/cctp) docs.
In this tutorial, you’ll use
[Circle’s Bridge Kit](https://developers.circle.com/bridge-kit) to
programmatically transfer USDC from an EVM chain (for example, Ethereum Sepolia)
or Solana Devnet to Arc Testnet with
[Circle Dev-Controlled Wallets](https://developers.circle.com/wallets/dev-controlled/create-your-first-wallet).
### [​
](#prerequisites)Prerequisites

Before you begin, make sure you have:

1. Installed [Node.js v22+](https://nodejs.org/)

2. A [Circle Developer Console](https://console.circle.com) account

An API key created in the Console:  

**Keys → Create a key → API key → Standard Key**
Your
[Entity Secret registered](https://developers.circle.com/wallets/dev-controlled/register-entity-secret)

### [​
](#step-1-set-up-your-project)Step 1: Set up your project

In this step, you prepare your project and environment.
#### [​
](#1-1-create-a-new-project)1.1. Create a new project

Create a new directory, navigate to it and initialize a new project.
Report incorrect code
Copy
Ask AI
```
# Set up your directory and initialize a Node.js project
mkdir crosschain-transfer
cd crosschain-transfer
npm init -y

# Set up module type
npm pkg set type=module

# Add run script
npm pkg set scripts.start="tsx --env-file=.env index.ts"

```

Install [Bridge Kit](https://www.npmjs.com/package/@circle-fin/bridge-kit),
[Circle Wallets adapter](https://www.npmjs.com/package/@circle-fin/adapter-circle-wallets)
and supporting tools.
Report incorrect code
Copy
Ask AI
```
# Install dependencies
npm install @circle-fin/bridge-kit @circle-fin/adapter-circle-wallets

# Install dev dependencies
npm install --save-dev tsx typescript @types/node

```

#### [​
](#1-2-initialize-and-configure-the-project)1.2. Initialize and configure the project

This command creates a `tsconfig.json` file:
Shell
Report incorrect code
Copy
Ask AI
```
npx tsc --init

```

Then, edit the `tsconfig.json` file:
Shell
Report incorrect code
Copy
Ask AI
```
# Replace the contents of the generated file
cat <<'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "types": ["node"]
  }
}
EOF

```

#### [​
](#1-3-configure-environment-variables)1.3 Configure environment variables

Create a `.env` file in the project directory with your Circle credentials and
wallet addresses, replacing these placeholders with your own credentials:

`CIRCLE_API_KEY`: your API key should be either environment-prefixed (for
example, `TEST_API_KEY:abc123:def456` or `LIVE_API_KEY:xyz:uvw`) or
base64-encoded strings.
`YOUR_ENTITY_SECRET`: your entity secret should be 64 lowercase alphanumeric
characters.
`YOUR_EVM_WALLET_ADDRESS` and `YOUR_SOLANA_WALLET_ADDRESS` are the wallet
addresses you control through Circle Wallets. You can fetch the addresses from
the [Circle Developer Console](https://console.circle.com/) or the
[list wallets](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/get-wallets)
endpoint. If you don’t have dev-controlled wallets, you will create them in
[Step 2](#step-2:-set-up-your-wallets).

Shell
Report incorrect code
Copy
Ask AI
```
echo "CIRCLE_API_KEY={YOUR_API_KEY}
CIRCLE_ENTITY_SECRET={YOUR_ENTITY_SECRET}
EVM_WALLET_ADDRESS={YOUR_EVM_WALLET_ADDRESS}
SOLANA_WALLET_ADDRESS={YOUR_SOLANA_WALLET_ADDRESS}" > .env

```

Important: The API key and Entity Secret are sensitive credentials. Do not
commit them to version control or share them publicly.
### [​
](#step-2-set-up-your-wallets)Step 2: Set up your wallets

In this step, you create two dev-controlled wallets and fund one of them with
testnet tokens to make the transfer. If you already have funded dev-controlled
wallets, skip to [Step 3](#step-3:-bridge-usdc).
#### [​
](#2-1-create-wallets)2.1. Create wallets

Install the
[Circle Wallets SDK](https://www.npmjs.com/package/@circle-fin/developer-controlled-wallets).
It is also possible to
[call the API directly](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/)
if you can’t use the SDK in your project.
Report incorrect code
Copy
Ask AI
```
npm install @circle-fin/developer-controlled-wallets

```

Import the Wallets SDK and initialize the client using your API key and Entity
Secret. Dev-controlled wallets are created in a
[wallet set](https://developers.circle.com/wallets/dev-controlled/create-your-first-wallet#1-create-a-wallet-set),
which serves as the source from which individual wallet keys are derived.
Report incorrect code
Copy
Ask AI
```
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: "<YOUR_API_KEY>",
  entitySecret: "<YOUR_ENTITY_SECRET>",
});

// Create a wallet set
const walletSetResponse = await client.createWalletSet({
  name: "Wallet Set 1",
});

// Create a wallet on Arc Testnet
const walletsResponse = await client.createWallets({
  blockchains: ["ARC-TESTNET", "SOL-DEVNET"],
  count: 1,
  walletSetId: walletSetResponse.data?.walletSet?.id ?? "",
});

```

If you are calling the API directly, you’ll need
to make two requests: one to [create the wallet set](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/create-wallet-set); one to [create the wallet](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/create-wallet).Be sure to replace the
[Entity Secret ciphertext](https://developers.circle.com/wallets/dev-controlled/entity-secret-management#what-is-an-entity-secret-ciphertext)￼
and the idempotency key in your request. If you are using the SDKs, this is
automatically taken care of for you.
You should now have two new Externally Owned Account (EOA) developer-controlled
wallets that you can also see from the
[Circle Developer Console](https://console.circle.com/wallets/dev/wallets). The
API response will look similar to the following:
Report incorrect code
Copy
Ask AI
```
[
  {
    id: "cd8a3a9a-ed17-5e9b-8f6b-7b01a0f27478",
    state: "LIVE",
    walletSetId: "1bb349fd-99dd-50a1-999b-05901533a98d",
    custodyType: "DEVELOPER",
    address: "0xb0b70e1d3599e84fcd61915c023ea12a843506b0",
    blockchain: "ARC-TESTNET",
    accountType: "EOA",
    updateDate: "2026-01-07T06:45:43Z",
    createDate: "2026-01-07T06:45:43Z",
  }, {
    id: "1557b6cf-3d54-5738-84ec-1ceba833e27b",
    state: "LIVE",
    walletSetId: "1bb349fd-99dd-50a1-999b-05901533a98d",
    custodyType: "DEVELOPER",
    address: "DGJ1oZtR7Nk1AidTeKYs1b557dJHHXKBNdVDem7uHDN8",
    blockchain: "SOL-DEVNET",
    accountType: "EOA",
    updateDate: "2026-01-07T06:45:43Z",
    createDate: "2026-01-07T06:45:43Z",
  }
]

```

#### [​
](#2-2-fund-a-wallet-with-testnet-tokens)2.2. Fund a wallet with testnet tokens

Obtain testnet USDC from the [Circle Faucet](https://faucet.circle.com/) and
native tokens from the [Console Faucet](https://console.circle.com/faucet) to
pay gas fees. You’ll need a funded balance to execute transactions using your
dev-controlled wallet.
#### [​
](#2-3-check-the-wallet’s-balance)2.3. Check the wallet’s balance

You can check your wallets’ balance from the
[Developer Console](https://console.circle.com/wallets/dev/wallets) or
programmatically by making a request to
[GET /wallets/{id}/balances](https://developers.circle.com/api-reference/wallets/developer-controlled-wallets/list-wallet-balance)
with the specified wallet ID.
Node.js

cURL
Report incorrect code
Copy
Ask AI
```
const response = await client.getWalletTokenBalance({
  id: "<WALLET_ID>",
});

```

### [​
](#step-3-bridge-usdc)Step 3: Bridge USDC

In this step, you set up your script, execute the bridge transfer, and check the
result.
#### [​
](#3-1-create-the-script)3.1. Create the script

Create an `index.ts` file in the project directory and add the following code.
This code sets up your script and transfers 1 USDC from your chosen chain to Arc
Testnet. It also listens to
[bridge events](https://developers.circle.com/bridge-kit/references/event-handling)
that occur during the transfer lifecycle.
Arbitrum

Avalanche
Base
Ethereum
Optimism
Polygon
Solana
Unichain
Report incorrect code
Copy
Ask AI
```
// Import Bridge Kit and the Circle Wallets adapter
import { BridgeKit } from "@circle-fin/bridge-kit";
import { createCircleWalletsAdapter } from "@circle-fin/adapter-circle-wallets";
import { inspect } from "util";

// Initialize the SDK
const kit = new BridgeKit();

const bridgeUSDC = async () => {
  try {
    // Set up the Circle Wallets adapter instance, works for both ecosystems
    const adapter = createCircleWalletsAdapter({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });

    console.log("---------------Starting Bridging---------------");

    // Use the same adapter for the source and destination blockchains
    const result = await kit.bridge({
      from: {
        adapter,
        chain: "Arbitrum_Sepolia",
        address: process.env.EVM_WALLET_ADDRESS!, // EVM address (developer-controlled)
      },
      to: {
        adapter,
        chain: "Arc_Testnet",
        address: process.env.EVM_WALLET_ADDRESS!, // EVM address (developer-controlled)
      },
      amount: "1.00",
    });

    console.log("RESULT", inspect(result, false, null, true));
  } catch (err) {
    console.log("ERROR", inspect(err, false, null, true));
  }
};

void bridgeUSDC();
```

#### [​
](#3-2-run-the-script)3.2. Run the script

Save the `index.ts` file and run the script in your terminal:
Report incorrect code
Copy
Ask AI
```
npm run start

```

For blockchains other than Arc, you will need native tokens to pay for gas.
The **approve** and **burn** steps require gas fees in the native token of the
source chain, while the **mint** step requires gas fees in the native token of
the destination chain.
#### [​
](#3-3-verify-the-transfer)3.3. Verify the transfer

After the script finishes, locate the returned `steps` array in the terminal
output. Each transaction step includes an `explorerUrl` field. Use that URL to
verify that the USDC amount matches the amount you transferred.
The following example shows how all four steps (Approve, Burn, Fetch
Attestation, Mint) might look like in the terminal output. The values shown are
for demonstration purposes only and don’t represent a real transaction:
Approve

Burn
Fetch Attestation
Mint
Report incorrect code
Copy
Ask AI
```
{
  name: 'approve',
  state: 'success',
  txHash: '0x809cd6678785c3cb48d73a8e35e5ef8fc21c1b1e22df767860bc30bd882fb470',
  data: {
    txHash: '0x809cd6678785c3cb48d73a8e35e5ef8fc21c1b1e22df767860bc30bd882fb470',
    status: 'success',
    cumulativeGasUsed: 429183n,
    gasUsed: 38596n,
    blockNumber: 20523074n,
    blockHash: '0x5d81b5abab77f19fb3e70df620276fe9b4be68172482afa0188296ead97c3033',
    transactionIndex: 5,
    effectiveGasPrice: 162000000000n
  },
  explorerUrl: 'https://testnet.arcscan.app/tx/0x809cd6678785c3cb48d73a8e35e5ef8fc21c1b1e22df767860bc30bd882fb470'
}

```

### [​
](#summary)Summary

After completing this tutorial, you’ve successfully:

- Created dev-controlled wallets

- Funded your wallet with testnet USDC

- Bridged USDC from one chain to another

## Related Links

- [Skip to main content](https://docs.arc.network/arc/tutorials/bridge-usdc-to-arc#content-area)
- [Arc Docs home page](https://docs.arc.network/)
- [Status](https://status.arc.network/)
- [Blog](https://arc.network/blog)
- [Community](https://community.arc.network/)
- [Arc.network](https://arc.network/)
- [Explorer](https://testnet.arcscan.app/)
- [Faucet](https://faucet.circle.com/)
- [Welcome to Arc](https://docs.arc.network/arc/concepts/welcome-to-arc)
- [Deploy on Arc](https://docs.arc.network/arc/tutorials/deploy-on-arc)