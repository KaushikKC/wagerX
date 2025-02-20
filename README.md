# 🏆 PredictionX - A Social Prediction Market for Friend Groups

## 📌 Overview

**PredictionX** is a decentralized, social prediction market platform where small friend groups can place bets on personal challenges and outcomes. Whether it's a fitness competition, work productivity challenge, or fun social wagers, PredictionX makes betting more engaging, accountable, and rewarding through **on-chain smart contracts** and **gamification features**.

## 🚀 Features

### ✅ **Core Features**

- **Create & Join Prediction Markets**: Users can create custom bets and invite friends.
- **Token-Based Wagering**: Users stake tokens as bets, with winners receiving payouts.
- **Automated Settlement**: Smart contracts handle fair resolution of bets.
- **Leaderboards & Gamification**: Earn XP, badges, and reputation based on wins.
- **Wallet Authentication**: Users sign in with their Movement Network wallet.
- **Group Betting & Social Integration**: Compete with friends and share results.

### 🔥 **Advanced Features**

- **Oracles (Pyth) Integration**: Fetches real-world data for bet settlement (e.g., fitness, finance, sports scores).
- **Reputation System**: Tracks user accuracy and trustworthiness in bets.
- **NFT Avatars**: Dynamic NFT profiles that evolve based on betting history.
- **Subscription & Premium Markets**: Access exclusive prediction pools via NFT passes.

## 💡 Use Cases

- **🏋️ Fitness & Lifestyle** → "Who will lose the most weight in 30 days?"
- **📈 Productivity Challenges** → "Who will close the most deals this quarter?"
- **⚽ Sports & Esports** → "Who will win the Champions League final?"
- **🍽️ Social Bets** → "First person to visit 10 new restaurants this month?"
- **🎤 Content Creation** → "Will my next video reach 10K views?"
- **🌎 Crypto & Web3** → "Will ETH hit \$5,000 by year-end?"

## 🛠 Tech Stack

### **🔗 Blockchain**

- **Movement Network** → Smart contracts using **Move language**.
- **Pyth Oracles** → Fetch external data (e.g., sports, financial, fitness stats).

### **📦 Backend (Node.js & MongoDB)**

- **Express.js** → REST API for market creation, betting, and settlements.
- **MongoDB** → Stores user profiles, bets, and history.
- **WebSockets** → Real-time leaderboard and bet updates.

### **🎨 Frontend (React/Next.js)**

- **Next.js & TailwindCSS** → Clean and responsive UI.
- **WalletConnect** → Movement Network wallet login.
- **GraphQL API** → Efficient querying for markets and bets.

## 📂 Folder Structure

```
PredictionX/
│── Backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── marketController.js
│   │   ├── betController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Market.js
│   │   ├── Bet.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── market.js
│   │   ├── bet.js
│   ├── server.js
│
│── wagerx-frontend/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── styles/
│   ├── utils/
│   ├── package.json
│
│── contracts/
│   ├── PredictionMarket.move
│   ├── NFTAvatars.move
│
│── README.md
```

## 🎮 Screens & UI Components

- **Home Page** → Browse active prediction markets.
- **Create Market Page** → Set rules, stakes, and invite friends.
- **Market Details** → View participants, place bets, and track live results.
- **Leaderboard** → Track top winners & reputation scores.
- **Wallet Page** → Connect Movement Network wallet.

## 🔧 Setup Instructions

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/KaushikKC/wagerX.git
cd wagerX
```

### **2️⃣ Backend Setup**

```sh
cd Backend
npm install
npm start
```

### **3️⃣ Frontend Setup**

```sh
cd wagerx-frontend
npm install
npm run dev
```

### **4️⃣ Smart Contract Deployment**

- Deploy Move contracts on Movement Network Testnet.
- Update contract addresses in the frontend `.env` file.

## 🎯 How to Contribute

1. **Fork the repo**
2. **Create a feature branch** (`git checkout -b new-feature`)
3. **Commit changes** (`git commit -m "Added new feature"`)
4. **Push to GitHub** (`git push origin new-feature`)
5. **Submit a PR**

## 📜 License

This project is **open-source** under the **MIT License**.

---


