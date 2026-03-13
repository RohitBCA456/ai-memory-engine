# AI Memory Engine SDK — Complete Documentation

## What is the AI Memory Engine SDK?

The AI Memory Engine SDK (`ai-memory-engine-sdk`) is a JavaScript client library that lets any application store, retrieve, and delete AI memory — persistent, semantically-searchable context for users — without managing any backend infrastructure. It connects to the AI Memory Engine platform, which handles classification, embedding generation, storage routing, and memory lifecycle management automatically.

The SDK is designed for developers building AI-powered applications who need their AI to remember things across sessions. Instead of managing Redis, MongoDB, or vector stores yourself, you call three simple methods and the engine handles everything else.

The live backend gateway is hosted at `https://ai-memory-engine-6uby.onrender.com`.

---

## What Problem Does This Solve?

Most AI models — including large language models — are stateless. Each conversation starts fresh with no memory of previous interactions. The AI Memory Engine solves this by giving your AI application a persistent memory layer:

- Store what a user says, prefers, or does during a session.
- Retrieve that context in future sessions, even days or weeks later.
- Delete memories when they are no longer relevant.
- Let the engine automatically decide whether a memory should be stored in short-term (Redis) or long-term (MongoDB) storage based on its classification.

---

## How Memory Storage Works

The AI Memory Engine uses two storage backends:

**Short-Term Memory (Redis)** is used for transient, session-level context. These memories are fast to write and retrieve, but are not intended to persist indefinitely. Each Redis memory is keyed with the pattern `mem:<appId>:<timestamp>` and stored as a hash.

**Long-Term Memory (MongoDB)** is used for durable, persistent context. When the classifier determines a memory is significant enough to persist — such as a user preference, biographical detail, or important fact — it is embedded using Ollama and stored in MongoDB with a vector embedding, a relevance score, a frequency counter, and a `lastSeenAt` timestamp for lifecycle management.

The routing decision between Redis and long-term MongoDB storage is made automatically by the Python Classifier service. You do not need to specify the storage tier when calling the SDK.

---

## Memory Data Model

When a memory is stored in MongoDB (long-term), it has the following structure:

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique MongoDB identifier for the memory |
| `userId` | String | The user this memory belongs to (you supply this) |
| `content` | String | The raw text content of the memory |
| `type` | String | The memory type, classified automatically by the Python service |
| `embedding` | Number[] | The Ollama-generated vector embedding for semantic search |
| `score` | Number | Relevance score assigned by the scoring service |
| `appId` | String | The application this memory belongs to |
| `frequency` | Number | How many times this memory has been accessed (default: 1) |
| `lastSeenAt` | Date | Last time this memory was accessed |
| `createdAt` | Date | When the memory was first created |

When a memory is stored in Redis (short-term), it is stored as a hash with at minimum the `content` and `createdAt` fields. The Redis key itself encodes the `appId` and creation timestamp.

The `memoryId` returned by `client.ingest()` is either a MongoDB ObjectId (for long-term memories) or a Redis key string (for short-term memories). The retrieval service automatically detects which storage backend to query based on whether the ID is a valid MongoDB ObjectId.

---

## Installation

Install from npm using your preferred package manager.

Using npm:
```
npm install ai-memory-engine-sdk
```

Using yarn:
```
yarn add ai-memory-engine-sdk
```

Using pnpm:
```
pnpm add ai-memory-engine-sdk
```

The SDK has one dependency: `axios` for HTTP requests. It is declared as a production dependency and will be installed automatically.

The package is ESM-only (`"type": "module"`). Your project must use ES module syntax. If your project uses CommonJS, use a dynamic `import()` call instead of `require()`.

Package name: `ai-memory-engine-sdk`
Current version: `1.0.1`
Author: Rohit Yadav
License: ISC

---

## Getting an API Key

Every request to the AI Memory Engine requires an API key. API keys are scoped to an application (called an "App") that you create on the platform.

To get an API key:

1. Sign up or log in at the AI Memory Engine Dashboard.
2. Click **Create App** in the navigation.
3. Enter a name and optional description for your application.
4. Your API key is generated and displayed immediately after creation.
5. Copy and store this key securely. It will be shown only once.

Each API key is tied to a specific App. Memories ingested using that key are associated with that App's namespace. You can create multiple Apps for different projects, and each will have its own isolated memory space.

---

## Initialization

Import the default export from the package and instantiate it with your API key.

```js
import AIMemoryClient from 'ai-memory-engine-sdk';

const client = new AIMemoryClient('your_api_key_here');
```

The constructor accepts a single argument: your API key string. If no API key is provided, it throws an error immediately: `"API Key is required to initialize the AI Memory Engine."`.

Internally, the client creates an Axios instance with:
- Base URL: `https://ai-memory-engine-6uby.onrender.com`
- Request timeout: 120,000 milliseconds (2 minutes)
- Header `x-api-key` set to your API key on every request
- Header `Content-Type: application/json`

The 2-minute timeout exists because the backend is hosted on a free-tier cloud provider that may need to cold-start. If a request times out, retry after a few seconds.

It is recommended to initialize the client once and reuse the instance across your application rather than creating a new instance per request.

---

## Methods

### client.ingest(userId, content, metadata?)

Stores a new memory for a given user. This is the primary write operation.

**Signature:**
```js
async ingest(userId: string, content: string, metadata?: object): Promise<object>
```

**Parameters:**

`userId` (string, required) — A unique identifier for the user this memory belongs to. This can be any string that uniquely identifies a user in your system, such as a database ID, a Clerk user ID, an email address, or a UUID. The memory engine uses this to associate memories with specific users. You are responsible for consistent userId values across sessions.

`content` (string, required) — The text content of the memory. This should be a natural language string describing what you want to remember. It can be a user statement, an AI observation, a preference, a fact, a conversation summary, or any other text. The classifier reads this content to determine the memory type and storage tier.

`metadata` (object, optional) — An optional plain object with additional key-value pairs. This is passed along with the memory payload for context. The current SDK version sends `userId`, `content`, and `metadata` to the memory service endpoint. Metadata is not stored by the current memory model schema but can be used to enrich future versions.

**Returns:** A Promise resolving to an object with the following shape:

```js
{
  message: "Memory processed successfully",
  memoryId: "69ad7bb7af2212d9b502dce9",  // MongoDB ObjectId or Redis key
  type: "long-term"                        // or "short-term", classified automatically
}
```

**HTTP details:** Sends a POST request to `/memory-service/memory` with body `{ userId, content, metadata }`. The gateway proxies this to the Memory Service, which emits a `MEMORY_INGESTED` event on the internal event bus. The embedding, storage, and scoring pipeline runs asynchronously, but the endpoint awaits the final `memoryId` via a correlation-based message bridge before responding. The response status is `202 Accepted`.

**Required fields on the server:** `userId`, `content`, and `appId` (derived from your API key). If any are missing, the server returns a 400 error.

**Example:**
```js
const result = await client.ingest(
  'user_abc123',
  'The user prefers Python over JavaScript for backend work.',
  { source: 'onboarding', sessionId: 'sess_xyz' }
);

console.log(result.memoryId);  // "69ad7bb7af2212d9b502dce9"
console.log(result.type);      // "long-term"
```

**Error:** Throws `"Ingestion Failed: <server message or network error>"` on failure.

---

### client.retrieve(memoryId)

Retrieves a stored memory by its ID.

**Signature:**
```js
async retrieve(memoryId: string): Promise<object>
```

**Parameters:**

`memoryId` (string, required) — The ID of the memory to retrieve. This is the `memoryId` value returned by `client.ingest()`. The server automatically detects which storage backend to query: if the ID is a valid MongoDB ObjectId, it queries MongoDB; otherwise it queries Redis. You do not need to know or specify the storage tier.

**Returns:** A Promise resolving to an object with the following shape:

```js
{
  message: "content found",
  content: { /* the full memory document from Redis or MongoDB */ }
}
```

For MongoDB memories, `content` is the full Mongoose document including `userId`, `content`, `type`, `score`, `embedding`, `appId`, `frequency`, `lastSeenAt`, and `createdAt`.

For Redis memories, `content` is the raw hash data stored at that key.

**HTTP details:** Sends a GET request to `/retrieval-service/retrieve-memory/:memoryId`. The gateway proxies this to the Retrieval Service, which uses `mongoose.Types.ObjectId.isValid(memoryId)` to determine the storage backend.

**Example:**
```js
const result = await client.retrieve('69ad7bb7af2212d9b502dce9');
console.log(result.content.content);   // "The user prefers Python over JavaScript..."
console.log(result.content.type);      // "long-term"
console.log(result.content.score);     // 0.87
```

**Error:** Throws `"Retrieval Failed: <server message or network error>"` on failure.

---

### client.delete(memoryId)

Permanently deletes a memory by its ID from all storage backends.

**Signature:**
```js
async delete(memoryId: string): Promise<object>
```

**Parameters:**

`memoryId` (string, required) — The ID of the memory to delete. The server uses the same detection logic as retrieval: MongoDB ObjectIds are deleted from MongoDB, other strings are deleted from Redis.

**Returns:** A Promise resolving to a confirmation object:

```js
{
  success: true,
  message: "Memory successfully removed"
}
```

If the memory is not found in any storage engine, the server returns a 404 error.

**HTTP details:** Sends a DELETE request to `/deletion-service/delete-memory/:memoryId`. The gateway proxies this to the Deletion Service.

**Example:**
```js
const response = await client.delete('69ad7bb7af2212d9b502dce9');
console.log(response.message); // "Memory successfully removed"
```

**Error:** Throws `"Deletion Failed: <server message or network error>"` on failure.

---

## Full API Gateway Routes

All SDK methods route through the API Gateway at `https://ai-memory-engine-6uby.onrender.com`. The gateway proxies requests to the appropriate internal microservice. All SDK requests require the `x-api-key` header, which the SDK sets automatically.

| SDK Method | HTTP Method | Gateway Route | Internal Service |
|---|---|---|---|
| `client.ingest()` | POST | `/memory-service/memory` | Memory Service |
| `client.retrieve()` | GET | `/retrieval-service/retrieve-memory/:id` | Retrieval Service |
| `client.delete()` | DELETE | `/deletion-service/delete-memory/:id` | Deletion Service |

The gateway also exposes user-service routes (used by the dashboard, not the SDK):

| HTTP Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/user-service/save-credentials` | Sync Clerk user to the DB | No |
| GET | `/user-service/logout` | Log out the current user | Yes (webToken) |
| POST | `/user-service/create-app` | Create a new App and generate API key | Yes |
| GET | `/user-service/manage-app` | List all Apps owned by the user | Yes |
| GET | `/user-service/telemetry/:appId` | Get 24h memory activity telemetry for an App | Yes |
| GET | `/user-service/memories/:appId` | List up to 50 recent memories for an App | No |
| GET | `/user-service/global-stats` | Get global memory counts (long-term + short-term) | Yes |
| DELETE | `/user-service/delete-app/:id` | Delete an App | Yes |
| DELETE | `/user-service/delete-memory/:memoryId` | Delete a specific memory | Yes |

---

## Memory Ingestion Pipeline (Internal)

When you call `client.ingest()`, the following happens inside the platform:

1. **API Gateway** receives the POST request, validates the `x-api-key` header against the database, and attaches the `appId` to the request context.

2. **Memory Service** receives the proxied request. It extracts `userId`, `content`, and `appId`. It calls the Python Classifier to determine the memory `type`. It generates a unique `correlationId` using the `MessageBridge` utility.

3. **Python Classifier** receives the content and returns a `type` label — for example, `"preference"`, `"fact"`, `"instruction"`, or `"episodic"`. This determines the storage tier routing.

4. **Event Bus** receives a `MEMORY_INGESTED` event with the full memory payload including `userId`, `content`, `appId`, `correlationId`, `type`, and `createdAt`.

5. **Embedding Service** consumes the event and generates a vector embedding for the content using Ollama. This embedding is used for semantic similarity search during retrieval.

6. **Storage Service** persists the memory. Short-term memories go to Redis with key `mem:<appId>:<timestamp>`. Long-term memories go to MongoDB with the full schema including the embedding vector.

7. **Scoring Service** assigns a relevance score to the memory based on content characteristics.

8. **Memory Service** receives the response via `MessageBridge.waitForResponse(correlationId)` and returns the `memoryId` and `type` to the caller.

---

## Memory Retrieval Logic

When you call `client.retrieve(memoryId)`, the Retrieval Service applies the following logic:

- It validates that `memoryId` is present in the request.
- It calls `mongoose.Types.ObjectId.isValid(memoryId)`.
- If the ID is a valid MongoDB ObjectId, it queries the `Memory` collection and returns the full document.
- If the ID is not a valid ObjectId (indicating a Redis key), it queries Redis using the key and returns the raw hash data.

This means you do not need to track which storage tier a memory is in. The `memoryId` from `ingest()` is sufficient to retrieve from either backend.

---

## Error Handling

All three methods — `ingest`, `retrieve`, and `delete` — throw `Error` instances on failure. Errors follow this format:

```
<Operation> Failed: <server error message or network error message>
```

Examples:
- `"Ingestion Failed: Unauthorized - Invalid API Key"`
- `"Ingestion Failed: Fields are missing"`
- `"Retrieval Failed: Memory not found"`
- `"Deletion Failed: Memory not found in any storage engine"`
- `"Ingestion Failed: Service is waking up, please try again in a few seconds."` (cold-start timeout)

Always wrap SDK calls in `try/catch`:

```js
try {
  const result = await client.ingest('user_123', 'User prefers dark mode.');
} catch (error) {
  if (error.message.includes('waking up')) {
    // Retry after a short delay
    await new Promise(resolve => setTimeout(resolve, 5000));
  } else {
    console.error(error.message);
  }
}
```

---

## Usage Examples

### Basic Usage

```js
import AIMemoryClient from 'ai-memory-engine-sdk';

const client = new AIMemoryClient(process.env.MEMORY_API_KEY);

// Store a memory
const result = await client.ingest('user_001', 'User works as a frontend developer.');
const memoryId = result.memoryId;

// Retrieve it
const memory = await client.retrieve(memoryId);
console.log(memory.content.content); // "User works as a frontend developer."

// Delete it
await client.delete(memoryId);
```

---

### Integrating With an AI Chatbot

This pattern stores every user message and AI response as a memory, building up a persistent history that can be injected into future prompts.

```js
import AIMemoryClient from 'ai-memory-engine-sdk';
import OpenAI from 'openai';

const memory = new AIMemoryClient(process.env.MEMORY_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(userId, userMessage) {
  // Store the user's message
  await memory.ingest(userId, userMessage, {
    type: 'user-message',
    timestamp: new Date().toISOString()
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: userMessage }]
  });

  const reply = completion.choices[0].message.content;

  // Store the AI response
  await memory.ingest(userId, reply, {
    type: 'ai-response',
    timestamp: new Date().toISOString()
  });

  return reply;
}
```

---

### Batch Ingestion

Store multiple memories at once using `Promise.all`. This is useful during onboarding when you know multiple facts about a user upfront.

```js
import AIMemoryClient from 'ai-memory-engine-sdk';

const client = new AIMemoryClient(process.env.MEMORY_API_KEY);

const userFacts = [
  'User is based in Mumbai, India.',
  'User prefers TypeScript over JavaScript.',
  'User works on a team of 5 engineers.',
  'User is interested in system design and distributed systems.',
  'User prefers written communication over video calls.'
];

const results = await Promise.all(
  userFacts.map(fact =>
    client.ingest('user_456', fact, { source: 'onboarding' })
  )
);

console.log(`Stored ${results.length} memories.`);
results.forEach(r => console.log(r.memoryId, r.type));
```

---

### Storing Structured Events as Memories

```js
await client.ingest(
  'user_789',
  `User upgraded to the Pro plan on ${new Date().toDateString()}.`,
  {
    event: 'plan_upgrade',
    plan: 'pro',
    previousPlan: 'free',
    appVersion: '3.0.0'
  }
);

await client.ingest(
  'user_789',
  'User completed the onboarding checklist.',
  { event: 'onboarding_complete', score: 100 }
);
```

---

### Handling Cold Starts

The backend is hosted on a free-tier cloud provider and may take up to 2 minutes to wake up after a period of inactivity. The SDK's timeout is set to 120 seconds to accommodate this. Here is a retry helper:

```js
async function ingestWithRetry(client, userId, content, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await client.ingest(userId, content);
    } catch (error) {
      const isTimeout = error.message.includes('waking up') ||
                        error.message.includes('timeout');
      if (isTimeout && attempt < retries) {
        console.log(`Attempt ${attempt} failed. Retrying in 5s...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        throw error;
      }
    }
  }
}
```

---

### CommonJS Compatibility

The package is ESM-only. In a CommonJS project, use dynamic `import()`:

```js
// In a .cjs file or a CommonJS module
async function initMemory() {
  const { default: AIMemoryClient } = await import('ai-memory-engine-sdk');
  const client = new AIMemoryClient('your_api_key_here');
  return client;
}
```

---

## TypeScript Usage

The SDK ships as plain JavaScript without bundled type declarations. Add a local declaration file to your TypeScript project for full type safety.

Create a file named `ai-memory-engine-sdk.d.ts` anywhere in your project's include path:

```ts
declare module 'ai-memory-engine-sdk' {
  export interface MemoryMetadata {
    [key: string]: string | number | boolean | undefined;
  }

  export interface IngestResult {
    message: string;
    memoryId: string;
    type: string;
  }

  export interface MemoryContent {
    _id?: string;
    userId: string;
    content: string;
    type?: string;
    score?: number;
    embedding?: number[];
    appId?: string;
    frequency?: number;
    lastSeenAt?: string;
    createdAt?: string;
    [key: string]: unknown;
  }

  export interface RetrieveResult {
    message: string;
    content: MemoryContent;
  }

  export interface DeleteResult {
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

## Environment Variable Conventions

The recommended way to pass your API key is via an environment variable. Never hardcode API keys in source code.

In a Node.js project with a `.env` file:

```
MEMORY_API_KEY=your_api_key_here
```

In your application:

```js
import AIMemoryClient from 'ai-memory-engine-sdk';

const client = new AIMemoryClient(process.env.MEMORY_API_KEY);
```

For Next.js, Vite, or other frontend frameworks, prefix the variable with the framework's required prefix (e.g. `NEXT_PUBLIC_MEMORY_API_KEY` or `VITE_MEMORY_API_KEY`) if calling from the browser. Note that exposing API keys in client-side code is a security risk — prefer calling the SDK from a server-side function or API route.

---

## Security Considerations

API keys authenticate all SDK requests. Treat them like passwords.

Do not commit API keys to source control. Use environment variables or a secrets manager.

Do not expose API keys in client-side JavaScript. The SDK is designed to be used in server-side or backend environments. If you need to call the memory engine from a frontend, proxy the request through your own API route that injects the key server-side.

If an API key is compromised, delete the associated App from the dashboard and create a new one. Each new App generates a new API key.

---

## Frequently Asked Questions

**What is a userId and how should I set it?**
A `userId` is any string that uniquely identifies a user in your system. It can be a database ID, a Clerk user ID, an email, or a UUID. You are responsible for keeping it consistent across sessions so that memories can be associated with the right user. There is no user registration step — just pass the same string every time for the same user.

**What is the difference between short-term and long-term memory?**
Short-term memories are stored in Redis and are fast but ephemeral — they can expire or be evicted. Long-term memories are stored in MongoDB with a vector embedding, relevance score, and timestamps. The classification is automatic based on the memory content. You do not choose the tier.

**How does semantic retrieval work?**
When a memory is classified as long-term, the Embedding Service generates a vector embedding of the content using Ollama. This embedding can be used for vector similarity search, allowing you to find memories that are semantically related to a query even if they don't share exact keywords. The current SDK exposes retrieval by ID only; semantic search by query text is available via the dashboard's Memory Explorer.

**What memory types are there?**
Memory types are assigned automatically by the Python Classifier service based on the content. Possible types include categories like preference, fact, instruction, and episodic. The `type` is returned in the `ingest()` response as a string.

**What happens to memories over time?**
Long-term memories stored in MongoDB include a `score`, `frequency`, and `lastSeenAt` field managed by the Scoring Service. Short-term Redis memories expire based on their TTL. The Deletion Service allows explicit deletion by ID via `client.delete()`.

**Can I use this with any AI model?**
Yes. The SDK is model-agnostic. You supply the text content to store — the SDK does not care whether it came from GPT-4, Claude, Gemini, or any other source. You integrate it into your AI pipeline wherever it makes sense to persist or recall information.

**What is the request timeout?**
The SDK sets a 120-second (2-minute) timeout on all requests. This is intentional because the backend may need time to cold-start. If you consistently see timeouts, it means the service is waking up — wait a moment and retry.

**How many memories can I store?**
There is no documented hard limit per app. MongoDB storage scales with the infrastructure. Redis memory is finite — short-term memories that are not retrieved regularly may be evicted. For long-term persistent storage, ensure memories are classified as long-term.

**Is the SDK open source?**
The SDK source is available on GitHub at `https://github.com/RohitBCA456/ai-memory-engine` in the `ai-memory-sdk/` directory. The license is ISC.

---

## Changelog

**v1.0.1** — Current release. Stable `ingest`, `retrieve`, and `delete` methods. Hardcoded gateway URL pointing to the live deployment. ESM module format. Single `axios` dependency.

**v1.0.0** — Initial release.

---

## Support and Links

GitHub Repository: https://github.com/RohitBCA456/ai-memory-engine

npm Package: https://www.npmjs.com/package/ai-memory-engine-sdk

Dashboard: https://ai-memory-engine-6uby.onrender.com

Author: Rohit Yadav

License: ISC
