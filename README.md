# DePay - Seamless Crypto Payments

## 1. **Project Title & Tagline**

**Project Name:** DePay

**Tagline:** Send crypto like email.

**Summary:** DePay is a user-friendly payment platform that abstracts away the complexity of blockchain. Users can send and receive USDC using just an email address, with fully automated wallet provisioning and zero key management headaches.

---

## 2. **Problem**

**The Problem:**
*   **Complexity:** Traditional crypto wallets require managing private keys, seed phrases, and gas fees, which is terrifying for new users.
*   **UX Friction:** Sending money requires long, error-prone hexadecimal addresses (e.g., `0x71C...`). One typo means lost funds.
*   **Onboarding:** Setting up a wallet and funding it with gas tokens typically takes multiple steps and apps.

**Who experiences this:**
*   Mainstream users who want to use stablecoins for payments but are intimidated by "Web3" complexity.
*   Developers building apps who don't want to force users to install browser extensions.

**Why existing solutions are insufficient:**
Most wallets prioritize self-custody over usability, or centralized exchanges (CEXs) hold your funds but don't offer seamless peer-to-peer payments on-chain without withdrawals.

---

## 3. **Solution**

**Our Solution:**
DePay uses **Circle's Developer-Controlled Wallets** to offer a hybrid experience:
1.  **Invisible Wallets:** Users log in with their existing credentials (email/social). A fully functional on-chain wallet is automatically created for them in the background.
2.  **Email-Based Transfers:** Users send money to an email address. The system resolves the recipient's wallet behind the scenes.
3.  **Gasless Experience:** (Future/Planned) The platform handles gas fees, so users only worry about their USDC balance.

**Key Innovation:**
We treat the blockchain as a settlement layer, not a user interface. By mapping database identities (Emails) to on-chain identities (Circle Wallet IDs), we bridge Web2 usability with Web3 speed and transparency.

---

## 4. **Key Features**

*   **Instant Onboarding:** Sign up and get a wallet generated instantly.
*   **Send via Email:** Transfer USDC to any registered user using just their email address.
*   **USDC Native:** Optimized for stablecoin transactions on Base Sepolia.
*   **Easy Deposits:** Simple QR code and copy-paste address for funding the account.
*   **Transaction History:** Clear, readable integrated transaction logs combining on-chain status with user details.
*   **Real-time Balance:** Instant visibility of wallet holdings.

---

## 5. **How It Works (System Overview)**

The system acts as a smart orchestration layer between the User and the Blockchain.

1.  **User Layer (Frontend):** Next.js application that provides a clean dashboard.
2.  **Logic Layer (Backend API):** Handles authentication, user-to-wallet address resolution, and communicates with Circle's APIs.
3.  **Infrastructure Layer (Circle):** Manages the private keys and executes transactions on the blockchain.
4.  **Data Layer (Prisma/Postgres):** Stores user profiles and maps them to their Circle Wallet IDs.

---

## 6. **User Flow**

1.  **Sign Up:** User logs in (e.g., via Google/Email).
2.  **Wallet Creation:** System checks if user has a wallet. If not, calls Circle API to create one and saves the ID.
3.  **Deposit:** User clicks "Deposit", scans QR code, and sends testnet USDC to their address.
4.  **Send Money:**
    *   User clicks "Send Money".
    *   Enters recipient's email (e.g., `friend@example.com`) and amount.
    *   System looks up `friend@example.com`'s wallet address.
    *   System initiates transfer via Circle API.
5.  **Confirmation:** Transaction appears in the dashboard history.

---

## 7. **Tech Stack**

*   **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn UI, Lucide React.
*   **Backend:** Next.js API Routes (Server Actions/API), Prisma ORM.
*   **Database:** SQLite (Dev) / PostgreSQL (Prod).
*   **Blockchain Infrastructure:** Circle Web3 Services (Developer-Controlled Wallets).
*   **Network:** Base Sepolia Testnet.
*   **Auth:** NextAuth.js.

---

## 8. **Architecture**

*   **Next.js Monorepo:** Handles both UI and API logic.
*   **Circle SDK:** The core engine (`@circle-fin/developer-controlled-wallets`). It bridges our off-chain database (User 1 = Wallet A) with on-chain actions.
*   **Security Boundary:** Private keys are never exposed to the frontend or even our own database. They are secured within Circle's MPC (Multi-Party Computation) infrastructure.
*   **Data Consistency:** We store a local record of transactions in our DB for faster UI loading, while the blockchain serves as the source of truth for balances.

---

## 9. **Smart Contracts**

**Status:** No Custom Smart Contracts.

**Why?**
We leverage the standard **USDC** smart contract and Circle's wallet infrastructure. The complexity here is in the *orchestration* and *user experience*, not in custom on-chain logic. This reduces audit risk and standardizes security.

---

## 10. **APIs & Integrations**

*   **Circle Web3 Services:**
    *   `createWalletSet` / `createWallets`: For user onboarding.
    *   `getWalletTokenBalance`: For real-time dashboard updates.
    *   `createTransaction`: For executing transfers.
*   **NextAuth:** For secure session management and protecting API routes.

---

## 11. **Security Considerations**

*   **Custody:** This is a custodial/semi-custodial model (Developer-Controlled). We (the developers) initiate transactions on behalf of users, but keys are secured by Circle utilizing MPC technology.
*   **Authentication:** Strict reliance on NextAuth sessions ensures only the logged-in user can initiate transfers for their wallet.
*   **Data:** User personal data (email) is stored securely and linked to wallet IDs, but never stored on-chain to preserve privacy.

---

## 12. **What We Built**

*   ✅ Full Authentication Flow
*   ✅ Automated Wallet Provisioning via Circle
*   ✅ Dashboard with Real-time USDC Balance
*   ✅ "Send to Email" Logic (Internal address resolution)
*   ✅ Deposit Modal with QR Code
*   ✅ Transaction History UI

---

## 13. **Demo Instructions**

1.  **Login:** Sign in with the demo credentials (or sign up).
2.  **View Balance:** Check the dashboard (initially $0.00).
3.  **Deposit:** Click "Deposit", copy the address.
4.  **Fund:** Send Base Sepolia USDC to this address (using a faucet or external wallet).
5.  **Send:** Click "Send Money", enter another registered user's email, and confirm.
6.  **Verify:** Check the "Recent Transactions" list.

*(Note: Requires Base Sepolia USDC for testing)*

---

## 14. **Getting Started (Local Setup)**

1.  **Clone the repo:**
    ```bash
    git clone <repo-url>
    cd depay
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file with:
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"
    CIRCLE_API_KEY="your-circle-api-key"
    CIRCLE_ENTITY_SECRET="your-entity-secret"
    ```

4.  **Setup Database:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 15. **Use Cases**

*   **Freelancer Payments:** Pay contractors globally in USDC without asking for complex wallet addresses.
*   **Remittances:** Send money home to family members using just their email account.
*   **eCommerce:** Simple checkout flow for merchants accepting stablecoins.

---

## 16. **Roadmap / Future Improvements**

*   **Gas Abstraction:** Implement a Paymaster to fully subsidize gas fees for users.
*   **Social Login:** Add Google/Apple sign-in for one-tap onboarding.
*   **Off-Ramp:** Integration with banking rails to convert USDC to Fiat.
*   **Notifications:** Email/Push notifications when you receive funds.

---

## 17. **Challenges We Faced**

*   **Circle API Rate Limits:** Handling API latency during the wallet creation process.
*   **Testnet Faucets:** Getting enough Base Sepolia USDC to test multiple flows was tedious.
*   **State Sync:** Keeping the local database in sync with on-chain status (solved by just fetching from chain for balances).

---

## 18. **Why This Matters**

Crypto will never reach mass adoption if we force grandmothers to store 24-word seed phrases. **DePay** proves that we can build crypto apps that feel exactly like Venmo or PayPal, unlocking the benefits of blockchain (speed, borderless, programmatic) without the UX nightmares.

---

## 19. **Team**

*   **[Your Name/Team]**: Full Stack Developer & Blockchain Integration.

---

## 20. **License**

MIT License
