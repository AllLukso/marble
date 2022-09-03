# Marble Wallet

Marble is a LUKSO-native wallet built for users with Universal Profiles to manage their tokens and vaults with ease. This project was built for the LUKSO Build Up! #1 Hackathon.

## Relevant Links
- Check out the [Live Deployment](https://marble.cool)
- Check out the [Walkthrough Demo](https://vimeo.com/744970725)
## Context
For LUKSO to thrive, it needs a world-class wallet; focused on providing the most user-friendly experience to seamlessly onboard the next billion users into the web3 creative economy.

This is why I’ve built Marble. A LUKSO-native wallet that allows users with Universal Profiles to effortlessly manage their tokens and vaults in an intuitive and aesthetics-first user interface.

## Core Features
0. View basic Universal Profile metadata
1. View LYX, LSP7, LSP8 tokens
2. Transfer LYX, LSP7, LSP8 tokens
3. View LSP9 vaults, associated metadata
4. Transfer and claim ownership of LSP9 vaults

## Tech Stack

- Network: LUKSO
- File Storage: IPFS + Firebase
- Host Service: Vercel
- Lukso Tooling: ERC725.js
- Ethereum Dev Framework: Hardhat
- Frontend Framework NextJS
- Frontend UI Library: Chakra UI
- Frontend Ethereum Library: Web3.js

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

*Warning: the code has ZERO testing and ZERO reponsive design because I was in a rush. Please ignore the sloppiness. Thanks for your understanding.*

## Next Steps for Marble
 - Add testing to all aspects of the codebase
 - Add responsive design for cross-platform support
 - Add fiat balance support in preparation for Mainnet
 - Add txn history, staking, governance functionalities
 - Find a talented team to help build out the vision

 ## Feedback for LUKSO Team
- Build LUKSO-native block explorer that provides better contract support
- Better way to index transactions (transaction relayer means no more ties to EOA)
- ERC725.js additional support for frontend libs (i.e. ethers.js, wagmi hooks, rainbow kit)
- Create vault metadata standard for a better user experience around vaults
- Metadata recovery system (e.g. when someone mistakenly wipes out owned assets list)
- Transaction UX improvements (need for batching transactions, minimize user friction)

## Let's Connect!
Not sure if I'll have the bandwidth to realize everything listed above, if you have any thoughts about this project or would like to contribute, [hit me up](https://twitter.com/iamminci)