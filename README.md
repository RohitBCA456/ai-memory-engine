# 🧠 AI Memory Engine

A production-ready, **hybrid microservice backend** that gives AI applications persistent, semantically-searchable memory. It combines **Redis** for fast short-term context and **MongoDB** for long-term storage, using **Ollama embeddings** to enable intelligent, meaning-based retrieval — not just keyword matching.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running with Docker](#running-with-docker)
  - [Running the Frontend](#running-the-frontend)
- [SDK Usage](#sdk-usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)

---

## Overview

The AI Memory Engine solves a fundamental problem in AI systems: **statelessness**. Most AI models have no memory between sessions. This engine provides a plug-and-play backend that any AI application can use to:

- **Store** user interactions and context as structured memories
- **Retrieve** relevant memories semantically (by meaning, not just keywords)
- **Manage** memory lifecycle — including scoring, expiry, and deletion

It ships with a **React dashboard** for visual memory management and a lightweight **JavaScript SDK** for easy integration into any application.

---

## Architecture

The system is composed of **9 independent microservices** orchestrated via Docker Compose, all communicating over a shared internal network.

```
┌─────────────────────────────────────────────────────┐
│                   React Dashboard (app/)             │
│         (Clerk Auth · Memory Explorer · Analytics)  │
└────────────────────────┬────────────────────────────┘
                         │ HTTP
                         ▼
              ┌──────────────────┐
              │   API Gateway    │  ← Single entry point (port 4000)
              └────────┬─────────┘
                       │ Routes to:
       ┌───────────────┼──────────────────┐
       ▼               ▼                  ▼
 ┌───────────┐  ┌─────────────┐  ┌──────────────────┐
 │  Memory   │  │  Retrieval  │  │  User Service    │
 │  Service  │  │  Service    │  │  (API Keys)      │
 └─────┬─────┘  └─────────────┘  └──────────────────┘
       │
       ▼ (async via Event Bus)
 ┌──────────────────────────────────────────────┐
 │  Classifier → Embedding → Storage → Scoring  │
 │  (Python)     (Ollama)   (Redis/Mongo) (TTL) │
 └──────────────────────────────────────────────┘
```

### Memory Flow

1. **Ingest** — A memory is sent to the Memory Service via the API Gateway.
2. **Classify** — The Python Classifier categorizes the memory type.
3. **Embed** — The Embedding Service generates a semantic vector via Ollama.
4. **Store** — The Storage Service writes to Redis (short-term) or MongoDB (long-term).
5. **Score** — The Scoring Service applies relevance and TTL scoring.
6. **Retrieve** — The Retrieval Service performs vector similarity search on demand.

---

## Features

- **🔀 Hybrid Memory Tiers** — Redis for fast, ephemeral short-term memory and MongoDB for durable long-term storage.
- **🔍 Semantic Retrieval** — Ollama-powered embeddings enable meaning-based search, not just exact matches.
- **🏗️ Microservice Architecture** — 9 independently deployable services with clear separation of concerns.
- **🔐 Authentication** — Full user auth via Clerk (sign up, login, protected routes, dark theme).
- **📊 Visual Dashboard** — React frontend to explore, manage, and monitor memories per application.
- **🗝️ API Key Management** — Per-user API keys managed by the User Service for secure SDK access.
- **📦 JavaScript SDK** — A minimal client library (`AIMemoryClient`) to integrate in any JS/TS project.
- **🐳 Docker-First** — One-command startup for the entire stack via `docker-compose`.
- **🧹 Memory Lifecycle** — Built-in deletion service and scoring service for TTL and relevance management.
- **📡 Event-Driven Pipeline** — Async processing between services via an internal Event Bus.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Auth | Clerk (`@clerk/clerk-react`) |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Backend | Node.js microservices |
| Classifier | Python |
| Embeddings | Ollama |
| Short-Term Memory | Redis |
| Long-Term Memory | MongoDB |
| Infrastructure | Docker, Docker Compose |
| SDK | JavaScript (ESM) + Axios |

---

## Project Structure

```
ai-memory-engine/
├── app/                        # React frontend dashboard
│   └── src/
│       ├── pages/              # Dashboard, MemoryExplorer, CreateApp, ManageApps
│       ├── components/         # Shared UI components & layouts
│       └── context/            # ThemeContext, AuthContext
├── services/
│   ├── api-gateway/            # Single entry point, routes requests (port 4000)
│   ├── memory-service/         # Handles memory ingestion
│   ├── retrieval-service/      # Semantic memory retrieval
│   ├── storage-service/        # Writes to Redis / MongoDB
│   ├── embedding-service/      # Generates Ollama vector embeddings
│   ├── classifier/             # Python service: classifies memory type
│   ├── scoring-service/        # Relevance scoring & TTL management
│   ├── memory-deletion-service/# Deletes memories by ID
│   ├── user-service/           # API key management per user
│   └── event-bus/              # Async inter-service messaging
├── ai-memory-sdk/              # JavaScript SDK for external integration
│   ├── index.js                # AIMemoryClient class
│   └── test-sdk.js             # SDK integration test
├── shared/                     # Shared utilities across services
├── docker-compose.yml          # Full stack orchestration
└── .gitignore
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+ (for local frontend dev)
- [Ollama](https://ollama.com/) running locally or accessible via network

### Environment Variables

Create a `.env` file in the project root. Required variables:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/ai-memory

# Redis
REDIS_URL=redis://localhost:6379

# Ollama
OLLAMA_BASE_URL=http://localhost:11434

# Clerk (for the frontend)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Gateway
PORT=4000
```

> Get your Clerk keys from [clerk.com](https://clerk.com) by creating a new application.

### Running with Docker

Start all backend microservices with a single command:

```bash
docker-compose up --build
```

This spins up all 9 services on the shared `ai-memory-network`:

| Service | Description |
|---|---|
| `api-gateway` | Entry point — exposed on `localhost:4000` |
| `memory-service` | Handles memory ingestion |
| `classifier` | Python-based memory type classifier |
| `storage-service` | Persists to Redis / MongoDB |
| `embedding-service` | Generates semantic vectors via Ollama |
| `retrieval-service` | Semantic search & retrieval |
| `deletion-service` | Memory deletion by ID |
| `user-service` | API key lifecycle management |
| `scoring-service` | Relevance scoring & TTL |

### Running the Frontend

```bash
cd app
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

---

## SDK Usage

The `ai-memory-sdk` provides a simple client for integrating the memory engine into any JavaScript application.

### Installation

```bash
# From the sdk directory
cd ai-memory-sdk
npm install
```

### Initialization

```js
import AIMemoryClient from './ai-memory-sdk/index.js';

const client = new AIMemoryClient('your_api_key_here');
```

> API keys are generated per-user via the dashboard under **Manage Apps**.

### Ingest a Memory

```js
const result = await client.ingest(
  'user_123',                          // userId
  'The user prefers dark mode and concise responses.',  // content
  { source: 'chat', session: 'abc' }   // optional metadata
);

console.log(result);
// { success: true, memoryId: '69ad7bb7af2212d9b502dce9', ... }
```

### Retrieve a Memory

```js
const memory = await client.retrieve('69ad7bb7af2212d9b502dce9');
console.log(memory);
```

### Delete a Memory

```js
const response = await client.delete('69ad7bb7af2212d9b502dce9');
console.log(response);
// { success: true, message: 'Memory deleted.' }
```

---

## API Reference

All requests go through the **API Gateway** at `https://ai-memory-engine-6uby.onrender.com` and require an `x-api-key` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/memory-service/memory` | Ingest a new memory |
| `GET` | `/retrieval-service/retrieve-memory/:id` | Retrieve a memory by ID |
| `DELETE` | `/deletion-service/delete-memory/:id` | Delete a memory by ID |

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<p align="center">Built with ❤️ by <a href="https://github.com/RohitBCA456">RohitBCA456</a></p>
