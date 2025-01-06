# Blockchain Mentorship Platform

A decentralized platform for connecting mentors and students in the blockchain space.

## Features

- Mentor registration and profile management
- Student registration
- Session scheduling and management
- Payment handling with platform fees
- Rating system for mentors
- Session history tracking

## Smart Contract

The platform is built on a smart contract with the following main features:

- Rating system (1-5 stars)
- Session duration: 1 hour
- Automatic payment distribution

## Technology Stack

- Solidity
- Hardhat
- React
- TypeScript
- Ethers.js
- Open Campus Codex Network

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- MetaMask wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Murat-Selim/mentorship-project.git
cd blockchain-mentorship
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory and add your private key:
```
PRIVATE_KEY=your_private_key_here
```

4. Compile the smart contract:
```bash
npx hardhat compile
```

5. Deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network opencampus
```

6. Start the development server:
```bash
npm start
```

### Testing

Run the test suite:
```bash
npx hardhat test
```

## Network Information

- Network: Open Campus Codex Sepolia
- RPC URL: https://rpc.open-campus-codex.gelato.digital/
- Chain ID: 656476
- Currency: ETH

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
