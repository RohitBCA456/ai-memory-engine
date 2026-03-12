# ai-memory-engine-sdk

> A high-performance JavaScript SDK for multi-tenant AI memory management.

Give your AI application persistent, semantically-searchable memory in minutes. The `ai-memory-engine-sdk` connects directly to the [AI Memory Engine](https://github.com/RohitBCA456/ai-memory-engine) backend, giving you a simple three-method API to **ingest**, **retrieve**, and **delete** memories — no infrastructure setup required.

[![npm version](https://img.shields.io/badge/npm-v1.0.1-blue)](https://www.npmjs.com/package/ai-memory-engine-sdk)
[![license](https://img.shields.io/badge/license-ISC-green)](#license)
[![module type](https://img.shields.io/badge/module-ESM-yellow)](#installation)

---

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [new AIMemoryClient(apiKey)](#new-aimemoryclientapikey)
  - [client.ingest(userId, content, metadata?)](#clientingestuserid-content-metadata)
  - [client.retrieve(memoryId)](#clientretrievememoryid)
  - [client.delete(memoryId)](#clientdeletememoryid)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [License](#license)

---

## Installation

Install from npm:

```bash
npm install ai-memory-engine-sdk
```

Or with yarn:

```bash
yarn add ai-memory-engine-sdk
```

Or with pnpm:

```bash
pnpm add ai-memory-engine-sdk
```

> **Note:** This package is **ESM-only** (`"type": "module"`). Your project must use ES module syntax (`import`/`export`). If you are using CommonJS (`require`), see the [CommonJS compatibility](#commonjs-compatibility) note below.

---

## Prerequisites

Before using the SDK, you need an **API key** from the AI Memory Engine platform:

1. Visit the [AI Memory Engine Dashboard](https://ai-memory-engine-6uby.onrender.com) and sign up.
2. Navigate to **Manage Apps** and create a new application.
3. Copy your generated **API key** — you'll pass this to `AIMemoryClient`.

---

## Quick Start

```js
import AIMemoryClient from 'ai-memory-engine-sdk';

// 1. Initialize with your API key
const client = new AIMemoryClient('your_api_key_here');

// 2. Store a memory
const result = await client.ingest(
  'user_123',
  'The user prefers concise answers and dark mode.'
);

console.log(result.memoryId); // e.g. "69ad7bb7af2212d9b502dce9"

// 3. Retrieve it later
const memory = await client.retrieve(result.memoryId);
console.log(memory);

// 4. Delete when no longer needed
await client.delete(result.memoryId);
```

---

## API Reference

### `new AIMemoryClient(apiKey)`

Creates a new client instance authenticated with your API key.

```js
import AIMemoryClient from 'ai-memory-engine-sdk';

const client = new AIMemoryClient('your_api_key_here');
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | ✅ Yes | Your application API key from the dashboard |

Throws an `Error` if `apiKey` is not provided.

---

### `client.ingest(userId, content, metadata?)`

Stores a new memory for a given user. The memory is automatically classified, embedded, and persisted to the appropriate storage tier (short-term Redis or long-term MongoDB).

```js
const result = await client.ingest(userId, content, metadata);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `userId` | `string` | ✅ Yes | A unique identifier for the user this memory belongs to |
| `content` | `string` | ✅ Yes | The text content of the memory |
| `metadata` | `object` | ❌ No | Optional key-value pairs for tagging (e.g. session, source) |

**Returns:** `Promise<object>` — the created memory record including its `memoryId`.

**Example:**

```js
const result = await client.ingest(
  'user_456',
  'User asked about React Server Components and prefers TypeScript.',
  {
    source: 'chat',
    sessionId: 'sess_abc123',
    topic: 'frontend'
  }
);

console.log(result);
// {
//   success: true,
//   memoryId: '69ad7bb7af2212d9b502dce9',
//   tier: 'long-term',
//   ...
// }
```

---

### `client.retrieve(memoryId)`

Retrieves a stored memory by its ID.

```js
const memory = await client.retrieve(memoryId);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `memoryId` | `string` | ✅ Yes | The ID of the memory to retrieve |

**Returns:** `Promise<object>` — the full memory object including content, metadata, and scores.

**Example:**

```js
const memory = await client.retrieve('69ad7bb7af2212d9b502dce9');

console.log(memory);
// {
//   memoryId: '69ad7bb7af2212d9b502dce9',
//   userId: 'user_456',
//   content: 'User asked about React Server Components...',
//   metadata: { source: 'chat', sessionId: 'sess_abc123' },
//   score: 0.92,
//   createdAt: '2025-01-01T12:00:00.000Z'
// }
```

---

### `client.delete(memoryId)`

Permanently deletes a memory by its ID from all storage tiers.

```js
const response = await client.delete(memoryId);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `memoryId` | `string` | ✅ Yes | The ID of the memory to delete |

**Returns:** `Promise<object>` — a confirmation object.

**Example:**

```js
const response = await client.delete('69ad7bb7af2212d9b502dce9');

console.log(response);
// { success: true, message: 'Memory deleted.' }
```

---

## Usage Examples

### With an AI Chatbot (e.g. OpenAI)

Store what a user tells the AI, then recall it in future sessions:

```js
import AIMemoryClient from 'ai-memory-engine-sdk';
import OpenAI from 'openai';

const memory = new AIMemoryClient(process.env.MEMORY_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(userId, userMessage) {
  // Persist the user's message as a memory
  await memory.ingest(userId, userMessage, { type: 'user-input' });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: userMessage }]
  });

  const reply = response.choices[0].message.content;

  // Persist the AI's response too
  await memory.ingest(userId, reply, { type: 'ai-response' });

  return reply;
}
```

---

### Batch Ingestion

```js
import AIMemoryClient from 'ai-memory-engine-sdk';

const client = new AIMemoryClient(process.env.MEMORY_API_KEY);

const facts = [
  'User is based in India.',
  'User speaks English and Hindi.',
  'User prefers morning standups.'
];

const results = await Promise.all(
  facts.map(fact =>
    client.ingest('user_789', fact, { source: 'onboarding' })
  )
);

console.log(`Stored ${results.length} memories.`);
```

---

### Storing Metadata-Rich Memories

```js
await client.ingest(
  'user_123',
  'User completed the onboarding flow and chose the Pro plan.',
  {
    event: 'onboarding_complete',
    plan: 'pro',
    timestamp: new Date().toISOString(),
    appVersion: '2.1.0'
  }
);
```

---

## Error Handling

All three methods throw descriptive `Error` instances on failure. Always wrap calls in `try/catch`:

```js
import AIMemoryClient from 'ai-memory-engine-sdk';

const client = new AIMemoryClient(process.env.MEMORY_API_KEY);

try {
  const result = await client.ingest('user_123', 'Some memory content.');
  console.log('Stored:', result.memoryId);
} catch (error) {
  console.error('Memory ingestion failed:', error.message);
  // e.g. "Ingestion Failed: Unauthorized - Invalid API Key"
}

try {
  const memory = await client.retrieve('invalid_id');
} catch (error) {
  console.error('Retrieval failed:', error.message);
  // e.g. "Retrieval Failed: Memory not found"
}
```

Error messages follow the format:

```
<Operation> Failed: <server message or network error>
```

---

## TypeScript Support

The SDK ships as plain JavaScript (ESM). If you are using TypeScript, you can augment it with a local declaration file.

Create `ai-memory-engine-sdk.d.ts` in your project:

```ts
declare module 'ai-memory-engine-sdk' {
  interface MemoryMetadata {
    [key: string]: string | number | boolean | undefined;
  }

  interface IngestResult {
    success: boolean;
    memoryId: string;
    tier?: string;
    [key: string]: unknown;
  }

  interface RetrieveResult {
    memoryId: string;
    userId: string;
    content: string;
    metadata?: MemoryMetadata;
    score?: number;
    createdAt?: string;
    [key: string]: unknown;
  }

  interface DeleteResult {
    success: boolean;
    message: string;
  }

  export default class AIMemoryClient {
    constructor(apiKey: string);
    ingest(userId: string, content: string, metadata?: MemoryMetadata): Promise<IngestResult>;
    retrieve(memoryId: string): Promise<RetrieveResult>;
    delete(memoryId: string): Promise<DeleteResult>;
  }
}
```

---

## CommonJS Compatibility

This package uses `"type": "module"` and only ships ESM. If your project uses CommonJS, use a dynamic `import()`:

```js
// In a CommonJS (.cjs) file:
async function main() {
  const { default: AIMemoryClient } = await import('ai-memory-engine-sdk');
  const client = new AIMemoryClient('your_api_key_here');
  // ...
}

main();
```

Alternatively, rename your file to `.mjs` to use standard ESM syntax.

---

## License

ISC © [Rohit Yadav](https://github.com/RohitBCA456)
