# 😁LoomX Server

## 🚀 STEP 1: Initialize Backend (server)

📁 Go inside server folder

```bash
cd server
```

📦 Initialize Node project

```bash
npm init -y
```

📦 Install dependencies

```bash
npm install express ethers dotenv cors
npm install --save-dev nodemon
```

## 📁 STEP 2: Backend Folder Structure

```bash
server/
├── src/
│   ├── blockchain/
│   │   ├── provider.js
│   │   └── contract.js
│   ├── routes/
│   │   └── loan.routes.js
│   ├── app.js
│   └── index.js
├── .env
├── package.json
```

## 🔐 STEP 3: Environment Variables (.env)

Create server/.env

```bash
PORT=5000
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
ADMIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY  -> private key from node
CONTRACT_ADDRESS=0xDEPLOYED_CONTRACT_ADDRESS  -> deployed Address
```

## ▶️ STEP 4: Run Backend

```bash
npm run dev
```
