# LoomX Lending – Hardhat Setup & Deployment Guide

This document explains the complete step-by-step procedure to set up the development environment, install dependencies, compile contracts, run tests, and deploy the `LoomXLending` smart contract using **Hardhat**.

---

## 1. Environment Setup

### 1.1 Install & Use Node.js (via NVM)

```bash
nvm install 20.11.1
nvm use 20.11.1
```

Verify versions:

```bash
node -v
npm -v
```

Expected:
Node.js: v20.11.1
npm: 10.2.4

## 2. Initialize the Project

Initialize a new Node.js project:

```bash
npm init -y
```

## 3. Install Hardhat

Install Hardhat (specific version):

```bash
npm install --save-dev hardhat@2.26.5
```

Create the Hardhat project:

```bash
npx hardhat
```

Choose:

- Create a TypeScript project
- Accept default values
- Install dependencies when prompted

## 4. Install Required Hardhat Dependencies

Install all required Hardhat plugins and developer dependencies:

```bash
npm install --save-dev @nomicfoundation/hardhat-chai-matchers@2.1.0 @nomicfoundation/hardhat-ethers@3.1.2 @nomicfoundation/hardhat-ignition@0.15.15 @nomicfoundation/hardhat-ignition-ethers@0.15.16 @nomicfoundation/hardhat-network-helpers@1.1.2 @nomicfoundation/hardhat-toolbox@6.1.0 @nomicfoundation/hardhat-verify@2.1.3 @typechain/ethers-v6@0.5.1 @typechain/hardhat@9.1.0 @types/chai@4.3.20 @types/mocha@10.0.10 @types/node@24.10.0 chai@4.5.0 hardhat-gas-reporter@2.3.0 solidity-coverage@0.8.16 ts-node@10.9.2 typechain@8.3.2 typescript@5.9.3
```

## 5. Install Ethers.js

Install Ethers.js (v6):

```bash
npm install ethers@6.15.0
```

## 6. Verify Installed Packages

Check Hardhat and Ethers versions:

```bash
npm list hardhat ethers
```

## 7. Run Default Tests

Run Hardhat test suite to confirm setup:

```bash
npx hardhat test
```

## 8. Add Smart Contract

Add your smart contract:

```bash
contracts/LoomXLending.sol
```

## 9. Clean, Compile & Test Contracts

After adding the contract, run:

```bash
npx hardhat clean
npx hardhat compile
npx hardhat test
```

## 10. Add Deployment Script

Add deployment script:

```bash
scripts/deploy/LoomXLending.ts
```

## 11. Start Local Hardhat Network

In a separate terminal, start the local node:

```bash
npx hardhat node
```

## 12. Deploy the Contract (Localhost)

Deploy LoomXLending to the local Hardhat network:

```bash
npx hardhat run scripts/deploy/LoomXLending.ts --network localhost
```

## 13. Deployment Complete

Once deployed successfully, the terminal will display:

- Deployer address
- Contract address
- Network information
