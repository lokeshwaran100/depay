# 🧾 Product Requirements Document (PRD)
## **Product Name:** DePay  
**Tagline:** Crypto payments as easy as email  
**Platform:** Web App  
**Primary Network:** Base  
**Settlement Asset:** USDC (via Circle APIs)

---

## 1. 🎯 Product Overview

**DePay** enables users to send USDC to others using just an email address — but only if the recipient has already signed up and created their wallet. The platform removes blockchain complexity by combining **Google authentication**, **email identity**, and **Circle’s USDC infrastructure** to deliver a familiar Web2-style payment experience on Web3 rails.

Users can:
- Log in with Google  
- Send USDC to registered users via email  
- View their balance and transaction history

---

## 2. 👤 Target Users

- Crypto-native users sending payments to non-crypto users  
- Startups paying freelancers globally  
- DAOs distributing rewards or bounties  
- Individuals sending cross-border payments

---

## 3. 🧩 Core Features & User Stories

---

### 🔐 Feature 1: Google Authentication

**User Story**  
_As a visitor, I want to sign up or log in using my Google account so that I can access DePay without managing passwords or wallets manually._

**Functional Requirements**
- Use Google OAuth for authentication  
- On first login:
  - Create a user profile in DePay backend  
  - Provision a **Circle Programmable Wallet** for the user  
- Store:
  - User ID  
  - Email  
  - Linked wallet ID and wallet address (Base)

**Success Criteria**
- User can log in and out securely  
- Wallet is automatically created without exposing private keys to the user

---

### 💸 Feature 2: Send USDC to an Email Address

**User Story**  
_As a user, I want to send USDC to someone using their email address, as long as they have already signed up on DePay and linked a wallet._

#### 🚫 Core Rule
DePay **does NOT create wallets for recipients automatically**. Funds can only be sent to emails already linked to a DePay wallet.

---

### Functional Flow

**Step 1 — Sender Inputs Payment Details**
- Recipient email  
- Amount in USDC

**Step 2 — Recipient Check**
Backend verifies whether the email is associated with a registered DePay user.

| Condition | Action |
|-----------|--------|
| ✅ Email exists & wallet linked | Continue to payout |
| ❌ Email not found | Show error prompting recipient to sign up |

**Error Message Example:**  
> "This email is not yet on DePay. Ask them to sign up to receive USDC payments."

Optional: “Send Invite” button to email the recipient an onboarding link.

**Step 3 — Send USDC via Circle**
- Fetch recipient’s Circle wallet ID  
- Call **Circle Crypto Payouts API**  
- Send USDC on **Base** to recipient wallet

**Step 4 — Status & Notification**
- Sender sees transaction status (Pending → Completed/Failed)  
- Recipient receives email notification of incoming funds

**Success Criteria**
- Funds are transferred on-chain to recipient wallet  
- Transaction hash stored and visible in UI

---

### 💰 Feature 3: Wallet Balance Display

**User Story**  
_As a user, I want to see my USDC balance so I know how much I can send._

**Functional Requirements**
- Fetch USDC balance using Circle Wallet APIs  
- Display:
  - Available balance  
  - Currency: USDC  
  - Network: Base

**Success Criteria**
- Balance updates after transactions  
- Data reflects real on-chain balance via Circle

---

### 📜 Feature 4: Transaction History

**User Story**  
_As a user, I want to see my past transactions so I can track who I paid and who paid me._

**Functional Requirements**
Display transaction list including:
- Type: Sent / Received  
- Counterparty email (if known)  
- Amount (USDC)  
- Date & time  
- Status (Completed / Pending / Failed)  
- Optional link to Base block explorer

**Data Sources**
- Circle transaction APIs  
- Internal database mapping user emails to wallet IDs

**Success Criteria**
- History loads quickly (<2 seconds target)  
- Accurate reflection of payment activity

---

## 4. 🏗️ System Architecture (High Level)

### Frontend
- React / Next.js web app  
- Google OAuth integration  
- Dashboard UI (Send, Balance, History)

### Backend
- Node.js / Express (or similar)  
- Handles:
  - Auth session management  
  - Circle API calls  
  - Email-to-wallet mapping  
  - Transaction logging

### Third-Party Services
- **Circle APIs**
  - Programmable Wallets  
  - Crypto Payouts  
- Google OAuth  
- Email service (SendGrid, Resend, etc.)

### Blockchain
- Base network  
- USDC transfers executed via Circle infrastructure

---

## 5. 🔒 Security & Compliance Considerations

- No private keys stored or exposed by DePay frontend  
- Wallets provisioned securely via Circle  
- Wallets only created with user login and consent  
- OAuth-based authentication  
- Rate limiting and abuse prevention on payout endpoints  
- Email ownership verified through Google authentication

---

## 6. 🚀 MVP Scope (Hackathon-Ready)

**Must Have**
- Google login  
- Auto wallet creation via Circle on first login  
- Send USDC to registered email  
- Balance display  
- Transaction history

**Nice to Have**
- Email notifications  
- Explorer links for transactions  
- Pending/processing UI states  
- Invite flow for unregistered recipients

---

## 7. 🏆 Success Metrics

- User can sign up and get a wallet in under 30 seconds  
- USDC payment to a registered user completes in under 1 minute  
- Transaction history correctly logs all payments  
- Demo shows full flow: Sign up → Send → Receive → View history

---

## 8. ❌ Explicit Non-Goals

- No wallet creation for users who have not signed in  
- No smart contract escrow system  
- No custodial holding of user funds by DePay  
- No anonymous claim links

---

**DePay Vision:**  
Make sending digital dollars as simple as sending an email — powered by USDC and built for the real world.