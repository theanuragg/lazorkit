# Lazorkit Tipper
**Gasless Solana micro-payments powered by Passkeys and Smart Wallets.**

## Table of Contents
- [Executive Summary](#executive-summary)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Testing & QA](#testing--qa)
- [Deployment & Operations](#deployment--operations)
- [Security & Compliance](#security--compliance)
- [Performance & Scalability](#performance--scalability)
- [Observability](#observability)
- [API & Integrations](#api--integrations)
- [Data & Storage](#data--storage)
- [Roadmap](#roadmap)
- [Known Issues & Limitations](#known-issues--limitations)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

## Executive Summary
Lazorkit Tipper addresses the high friction of crypto onboarding by eliminating seed phrases and gas fees. Targeted at non-crypto-native users, it enables instant, secure Solana transactions using familiar biometric authentication (Passkeys).

Unlike traditional wallets that require managing private keys and SOL for rent/fees, Lazorkit Tipper leverages Account Abstraction (Smart Wallets). Users authenticate via FaceID/TouchID, and transactions are sponsored by a comprehensive Paymaster infrastructure. This product serves as a reference implementation for high-conversion consumer crypto applications.

## Architecture
The system follows a hybrid architecture: a "thick" mobile client handling cryptographic signing and blockchain interaction, supported by a lightweight backend for user profile management and transaction indexing.

```mermaid
flowchart LR
    Client[Mobile App (Expo)] -->|Biometric Auth| Portal[Lazorkit Portal]
    Client -->|Gasless Tx| Paymaster[Lazorkit Paymaster]
    Client -->|RPC| Solana[Solana Devnet]
    Client -->|HTTPS| Backend[Express API]
    Backend --> DB[(PostgreSQL)]
```

### Key Components
- **Mobile Client**: built with **Expo (React Native)**. Manages the Smart Wallet state using `@lazorkit/wallet`. Handles local signing via device secure enclave.
- **Backend API**: **Node.js/Express**. Acts as an indexer and user directory. Validates JWTs and tracks transaction history off-chain for rapid UI updates.
- **Database**: **PostgreSQL** configured via **Prisma**. Stores user profiles, wallet mappings, and transaction metadata.
- **Infrastructure**:
    - **Lazorkit Portal**: Handles Passkey registration/recovery.
    - **Lazorkit Paymaster**: Sponsors transaction gas fees.

### Tech Stack
- **Mobile**: React Native 0.81, Expo 54, React 19.
- **Backend**: Express 5, Prisma 7, Zod 4.
- **Blockchain**: Solana Web3.js 1.98.

## Features
- **Passkey Authentication**: Zero-password login using on-device biometrics (WebAuthn). No seed phrases to lose.
- **Gasless Transactions**: All network fees are sponsored. Users send 10 USDC and the recipient gets 10 USDC; no SOL balance required for gas.
- **Smart Accounts**: Deployed primarily on Solana Devnet. Supports batched transactions and session keys (roadmap).
- **Instant Balance Scync**: Hooks directly into Solana RPC for real-time state, effectively bypassing backend latency for critical financial data.

## Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL v14+
- Expo Go (on mobile device) or Android/iOS Emulator

### Installation

1. **Bootstrap Repository**
   ```bash
   git clone https://github.com/superteam/lazorkit.git
   cd lazorkit
   npm install
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update DATABASE_URL in .env
   npx prisma migrate dev --name init
   npm run dev
   ```

3. **Start Mobile App**
   Open a new terminal in the root directory:
   ```bash
   npx expo start
   ```
   Scan the QR code with your phone.

4. **Sanity Check**
   - Backend health: `curl http://localhost:3000/health`
   - Mobile: App should load and show "Connect with Passkey".

## Configuration

The application uses environment variables for configuration. Security-critical values must not be committed.

### Backend (`server/.env`)

| Variable | Default | Required | Description |
|---------|---------|----------|-------------|
| `NODE_ENV` | development | Yes | Runtime mode (development/production) |
| `PORT` | 3000 | No | API Server port |
| `DATABASE_URL` | - | Yes | Postgres connection string |
| `JWT_SECRET` | - | Yes | Secret for signing access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | - | Yes | Secret for refresh tokens (min 32 chars) |
| `SOLANA_RPC_URL` | devnet | No | RPC endpoint for server-side verification |
| `LAZORKIT_PAYMASTER_URL` | - | No | Paymaster endpoint for backend-delegated txs |

### Mobile
Configuration is injected via `app.json` or build-time constants. RPC URLs are currently hardcoded to Devnet in `useLazor.ts` for the MVP.

## Development

### Project Layout
- `/app`: Expo Router screens and navigation.
- `/components`: Reusable UI components (`LoginButton`, `GaslessTip`).
- `/hooks`: Custom React hooks (`useLazor`).
- `/server`: Standalone Express backend.
    - `/src/auth`: Authentication logic.
    - `/src/wallet`: Wallet interaction endpoints.

### Workflow
- **Linting**: `npm run lint` (ESLint).
- **Formatting**: `npm run fmt` (Prettier).
- **Database**: Use `npx prisma studio` to inspect data locally.

## Testing & QA

Currently, the project relies on **Type Checking** and **Manual QA**.

### Test Suite
Run the type checker to ensure contract adherence:
```bash
npx tsc --noEmit
```

### QA Protocol
1. **Auth Flow**: Verify Passkey creation and login.
2. **Transaction Flow**: Send SOL to a fresh wallet. Confirm success on Solana Explorer.
3. **Error Handling**: Disconnect network and attempt transaction; verify graceful failure.

## Deployment & Operations

### Mobile
- **Distribution**: EAS (Expo Application Services).
- **Build**: `eas build --profile production --platform all`.
- **Update**: `eas update` for OTA updates (JavaScript only).

### Backend
- **Environment**: Dockerized Node.js container.
- **Database**: Managed PostgreSQL (AWS RDS / Supabase).
- **CI/CD**: GitHub Actions triggers verification on PR merge.

## Security & Compliance

### Threat Model
- **Device Compromise**: Private keys are stored in the Secure Enclave. Access requires biometric proof per-transaction (configurable).
- **Paymaster Abuse**: Rate limiting is enforced at the Paymaster level restricts daily spend per IP/Wallet.

### Data Privacy
- **PII**: We store only Email and Display Name.
- **Wallet Link**: Wallet addresses are public on-chain data.
- **Encryption**: All tokens are hashed. DB connections require SSL.

## Performance & Scalability

- **RPC Load**: Client-side RPC calls are decentralized; throughput depends on the Solana cluster status.
- **Backend Latency**: Profiles are cached. Write operations are async where possible.
- **Bottlenecks**: Paymaster signature generation is the primary rate limiter for write operations (~200ms overhead).

## Observability

- **Logging**: Morgan (dev) / JSON structured logs (prod).
- **Metrics**: Basic uptime monitoring via `/health` endpoint.
- **Tracing**: Not implemented for MVP.

## API & Integrations

The backend exposes a REST API for user data.

**Example: Get Current User**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Solana Integration**
- **Network**: Devnet (ID: `Gsuz...4xYs`).
- **Standard**: SPL Token & Native SOL Transfer.

## Data & Storage

- **Schema**: Defined in `schema.prisma`.
- **Primary Entities**: `User`, `Transaction`.
- **Migrations**: Managed via Prisma Migrate.
- **Backup**: Daily snapshots of the PostgreSQL volume.

## Roadmap

**Q2 2026**
- [ ] Mainnet Beta Launch.
- [ ] USDC SPL Token Support.

**Q3 2026**
- [ ] Social Recovery for Smart Wallets.
- [ ] Fiat On-ramp integration.

## Known Issues & Limitations

- **Expo Go**: Passkeys may have erratic behavior on some Android emulators; physical device recommended.
- **Devnet Only**: Hardcoded to Devnet RPCs.
- **No Test Coverage**: Unit tests are currently absent.

## FAQ

**Q: Do I need SOL to use this?**
A: No. The Paymaster covers all gas fees.

**Q: Is this non-custodial?**
A: Yes. The private key never leaves your device's secure hardware.

## Contributing

We follow a standard PR workflow.
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/amazing-thing`).
3. Commit changes (Conventional Commits).
4. excessive testing.
5. Open a Pull Request.

## License

MIT License. See [LICENSE](./LICENSE) for details.
