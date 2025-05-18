# Monad Empire Game

![Monad Empire Logo](./public/logo.png)

An incremental blockchain-based game, developed with Next.js, Prisma, and MongoDB, powered by the Monad Testnet.

## 🚀 Features

* **Connect Metamask Wallet** — Easily connect your Metamask wallet to interact with the game.
* **Testnet Transactions** — Every time you level up, a transaction is made on the Monad Testnet.
* **Accumulate Wealth** — Keep growing your empire and climb the ranks.
* **Leaderboard (Coming Soon)** — Compete against others as you progress.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, TailwindCSS, Shadcn UI
* **Backend:** Prisma, MongoDB, Neon Database
* **Blockchain:** Monad Testnet
* **Libraries:** Radix UI, React Query, Zustand, Recharts

---

## 📦 Installation

```bash
# Clone the repository
git clone git@github.com:silverhandbtc/monad-empire-game.git

# Navigate to the project directory
cd monad-empire-game

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run the application
npm run dev
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_MONAD_CHAIN_ID="0x279f"
NEXT_PUBLIC_MONAD_RPC_URL="https://testnet-rpc.monad.xyz"
NEXT_PUBLIC_MONAD_EXPLORER_URL="https://testnet.monadexplorer.com/"
NEXT_PUBLIC_MONAD_CHAIN_NAME="Monad Testnet"
NEXT_PUBLIC_MONAD_SYMBOL="MON"
NEXT_PUBLIC_MONAD_NAME="Monad"
NEXT_PUBLIC_MONAD_DECIMAL=18
DATABASE_URL=<your-database-url>
```

---

## 🗂️ Project Structure

```plaintext
├── public
│   └── logo.png
├── prisma
│   └── schema.prisma
├── src
│   ├── app
│   ├── components
    ├── config
    ├── hooks
    ├── lib
    ├── providers
│   ├── services
│   └── utils
├── .env
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🌐 Links

* [Website](http://www.monadempire.xyz)
* [GitHub Issues](https://github.com/silverhandbtc/monad-empire-game/issues)

---

Developed with 💙 by [silverhandbtc](https://github.com/silverhandbtc)
