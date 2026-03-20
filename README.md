🚀 StellarScribe: Decentralized BlogStellarScribe is a high-performance, decentralized blogging platform built on the Stellar Network using Soroban Smart Contracts. It allows users to own their content, tip authors in XLM, and ensure censorship-resistant publishing.🛠 Tech StackSmart Contracts: Rust & Soroban SDKFrontend: Next.js 15+, Tailwind CSS, Shadcn/UIStellar Integration: @stellar/stellar-sdk, freighter-apiStorage: On-chain (Metadata) + IPFS/Arweave (Content Body)Development: Stellar CLI, Cargo✨ FeaturesDecentralized Publishing: Posts are cryptographically signed and stored with references on the Stellar ledger.Micropayments: Integrated tipping system using XLM or custom Soroban tokens.Wallet Auth: Passwordless login via Freighter Wallet or Passkeys.Content Governance: DAO-ready structure for community-led moderation.🚀 Quick Start1. PrerequisitesRust & CargoStellar CLIFreighter Wallet (Set to Testnet/Futurenet)Node.js (v20+)2. Environment SetupBash# Clone the repository
git clone https://github.com/Pranjal-debug/Full_stack_Dapp.git

# Install frontend dependencies
npm install
3. Deploy Smart ContractsThe blog logic is written in Rust. You'll need to deploy it to the Stellar Testnet.Bash# Navigate to contracts
cd contracts

# Build the WASM contract
stellar contract build

# Deploy to testnet (replace <identity> with your Stellar CLI identity)
stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/blog_contract.wasm \
    --source <identity> \
    --network testnet
Note: Copy the Contract ID generated above and paste it into your .env.local file.4. Run FrontendBash# Return to root and start the dev server
npm run dev
Open http://localhost:3000 to view the DApp.📂 Project StructurePlaintext├── contracts/             # Soroban Smart Contracts (Rust)
│   ├── src/lib.rs         # Main Blog logic (Post, Update, Delete)
│   └── Cargo.toml         # Rust dependencies
├── src/                   # Next.js Frontend
│   ├── components/        # UI Components (Editor, PostCard)
│   ├── hooks/             # Custom Stellar/Wallet hooks
│   └── lib/               # Stellar SDK & Soroban client helpers
├── public/                # Static assets
└── .env.example           # Environment variables template
📜 Smart Contract APIThe blog_contract handles the following core functions:FunctionDescriptioncreate_post(author, cid)Stores a new post's IPFS CID linked to an author.get_post(post_id)Retrieves post metadata and storage reference.tip_author(post_id, amount)Transfers XLM from reader to author via Soroban.update_profile(name, bio)Manages decentralized identity on-chain.🤝 ContributingFork the ProjectCreate your Feature Branch (git checkout -b feature/AmazingFeature)Commit your Changes (git commit -m 'Add some AmazingFeature')Push to the Branch (git push origin feature/AmazingFeature)Open a Pull Request

⚖️ License
Distributed under the MIT License. See LICENSE for more information.
