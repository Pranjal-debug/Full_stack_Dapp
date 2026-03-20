# 🌐 Decentralized Blog DApp (Stellar)

A full-stack decentralized blogging platform built on the **Stellar blockchain**, enabling users to create, publish, and interact with blog content in a censorship-resistant and trustless environment.

---

## 🚀 Overview

This project is a **Decentralized Application (DApp)** that allows users to:

* 📝 Create and publish blog posts on-chain or via decentralized storage
* 👤 Own their identity through Stellar wallets
* 💬 Interact with posts (like, comment, tip)
* 🔐 Maintain control over their content without centralized authorities

The app leverages the **Stellar network** for fast, low-cost transactions and integrates with modern web technologies for a seamless user experience.

---

## 🏗️ Architecture

### 1. Frontend

* Framework: React / Next.js
* Styling: TailwindCSS / CSS Modules
* Wallet Integration: Stellar Wallets (Freighter, Albedo)
* Features:

  * User authentication via wallet
  * Blog feed & post viewer
  * Create/edit post UI
  * Like/comment/tip functionality

### 2. Backend (Optional Hybrid Layer)

* Node.js / Express (or serverless functions)
* Handles:

  * Indexing blockchain data
  * Metadata caching
  * Off-chain interactions (if needed)

### 3. Blockchain Layer (Stellar)

* Smart logic via:

  * Stellar Soroban (smart contracts)
  * Stellar transactions & operations
* Stores:

  * Post hashes / references
  * User interactions (likes, tips)

### 4. Storage

* IPFS / Arweave for decentralized content storage
* Stores:

  * Blog content (text, images)
  * Metadata JSON

---

## 🔧 Tech Stack

| Layer      | Technology        |
| ---------- | ----------------- |
| Frontend   | React / Next.js   |
| Backend    | Node.js / Express |
| Blockchain | Stellar (Soroban) |
| Storage    | IPFS / Arweave    |
| Wallets    | Freighter, Albedo |

---

## ⚙️ Installation

### Prerequisites

* Node.js (v18+)
* Yarn / npm
* Stellar wallet (Freighter recommended)

### Clone Repository

```bash
git clone https://github.com/Pranjal-debug/Full_stack_Dapp.git
cd Full_stack_Dapp.git
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

---

## ✨ Features

* 🔐 Wallet-based authentication (no passwords)
* ✍️ Create & publish decentralized blog posts
* 📡 Immutable content storage
* 💸 Tip creators using Stellar Lumens (XLM)
* ❤️ Like & comment via blockchain transactions
* 🌍 Fully decentralized & censorship-resistant

---

## 📦 Smart Contract (Soroban)

Example contract responsibilities:

* Register blog posts
* Store IPFS hashes
* Track likes/tips
* Associate posts with wallet addresses

---

## 🧪 Testing

```bash
npm run test
```

Test coverage includes:

* Smart contract logic
* API endpoints
* UI components

---

## 🚀 Deployment

### Frontend

* ReactJS / Tailwind css

### Backend

* Rust

### Smart Contracts

* Deploy on Stellar Testnet / Mainnet using Soroban CLI

---

### Uploads

* Contract id: CB7W4JB5KTVT5PM4VWC4JVXUR5CFOTYCW4QMON62GLZ24BSUXK2PS5YE
* UI ss:
  <img src='https://github.com/Pranjal-debug/Full_stack_Dapp/blob/main/Screenshot%202026-03-20%20152315.png?raw=true' />
*Contract ss:
<img src='https://github.com/Pranjal-debug/Full_stack_Dapp/blob/main/Screenshot%202026-03-20%20144243.png?raw=true' />

## 🔮 Future Improvements

* 🧠 Decentralized identity (DID integration)
* 🪙 Tokenized incentives for writers
* 📊 On-chain reputation system
* 🔍 Advanced search & indexing
* 📱 Mobile app support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a pull request

---

## 🙌 Acknowledgements

* Stellar Development Foundation
* Open-source contributors
* IPFS & Web3 ecosystem

---

## 📬 Contact

For questions or collaboration:

* Email: pranjalgupta2903@gmail.com
* GitHub: https://github.com/Pranjal-debug

---

> ⚡ Build freely. Write fearlessly. Own your content.
