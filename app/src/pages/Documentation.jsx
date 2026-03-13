import React, { useState, useContext, createContext } from "react";
import {
  Book, Terminal, Package, Database, Code2, ChevronRight,
  Copy, Check, Zap, Shield, GitBranch, ExternalLink,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

// ─── Internal context so every sub-component can read isDarkMode ──────────────
const DarkCtx = createContext(false);
const useDark = () => useContext(DarkCtx);

// ─── Syntax highlighter (code blocks always stay dark-themed) ─────────────────
function highlight(code) {
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(\/\/[^\n]*)/g, '<span style="color:#6b7280;font-style:italic">$1</span>')
    .replace(/\b(import|export|default|from|const|let|var|async|await|function|return|new|class|if|else|for|try|catch|throw|true|false|null|undefined)\b/g,
      '<span style="color:#60a5fa">$1</span>')
    .replace(/\b(string|number|boolean|object|Promise|Error)\b/g,
      '<span style="color:#34d399">$1</span>')
    .replace(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g,
      '<span style="color:#fbbf24">$1$2$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#f87171">$1</span>');
}

// ─── Base components ──────────────────────────────────────────────────────────
function CodeBlock({ code, language = "js" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ background: "#0d1117", borderRadius: 12, overflow: "hidden", border: "1px solid #21262d", margin: "16px 0", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: "#161b22", borderBottom: "1px solid #21262d" }}>
        <span style={{ color: "#8b949e", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{language}</span>
        <button onClick={copy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#34d399" : "#8b949e", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "20px", overflowX: "auto", fontSize: 13, lineHeight: 1.7, color: "#e6edf3" }}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}

function Badge({ children, color = "#6366f1" }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

function Table({ headers, rows }) {
  const dark = useDark();
  return (
    <div style={{ overflowX: "auto", margin: "16px 0", borderRadius: 10, border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: dark ? "#1e293b" : "#f1f5f9" }}>
            {headers.map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: dark ? "#94a3b8" : "#64748b", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `1px solid ${dark ? "#334155" : "#e2e8f0"}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : (dark ? "#0f172a" : "#f8fafc") }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 16px", color: j === 0 ? "#a78bfa" : (dark ? "#cbd5e1" : "#374151"), fontFamily: j === 0 ? "'JetBrains Mono','Fira Code',monospace" : "inherit", fontSize: j === 0 ? 12 : 13, borderBottom: `1px solid ${dark ? "#1e293b" : "#f1f5f9"}` }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }) {
  const dark = useDark();
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ color: dark ? "#f1f5f9" : "#0f172a", fontSize: 22, fontWeight: 800, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}` }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children }) {
  const dark = useDark();
  return <p style={{ color: dark ? "#94a3b8" : "#475569", lineHeight: 1.8, marginBottom: 14, fontSize: 14 }}>{children}</p>;
}

function H3({ children }) {
  const dark = useDark();
  return <h3 style={{ color: dark ? "#e2e8f0" : "#1e293b", fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 10 }}>{children}</h3>;
}

function InlineCode({ children }) {
  const dark = useDark();
  return <code style={{ background: dark ? "#1e293b" : "#f1f5f9", color: "#7c3aed", border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`, padding: "2px 7px", borderRadius: 5, fontSize: "0.88em", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{children}</code>;
}

function InfoCard({ icon, title, desc }) {
  const dark = useDark();
  return (
    <div style={{ background: dark ? "#0f172a" : "#fffbeb", border: `1px solid ${dark ? "#1e293b" : "#fde68a"}`, borderRadius: 12, padding: 18, display: "flex", gap: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ color: dark ? "#f1f5f9" : "#1e293b", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
        <div style={{ color: dark ? "#64748b" : "#6b7280", fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  const dark = useDark();
  return (
    <div style={{ background: dark ? "#1e293b" : "#f8fafc", borderRadius: 12, padding: 18, border: `1px solid ${dark ? "#334155" : "#e2e8f0"}` }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ color: dark ? "#f1f5f9" : "#0f172a", fontWeight: 700, marginBottom: 6, fontSize: 14 }}>{title}</div>
      <div style={{ color: dark ? "#64748b" : "#6b7280", fontSize: 12, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

function StorageCard({ label, tag, color, desc }) {
  const dark = useDark();
  return (
    <div style={{ background: dark ? "#0f172a" : "#fafafa", border: `1px solid ${color}33`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ color, fontWeight: 800, fontSize: 15 }}>{label}</span>
        <Badge color={color}>{tag}</Badge>
      </div>
      <p style={{ color: dark ? "#94a3b8" : "#6b7280", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

function PipelineStep({ step, total, title, color, desc }) {
  const dark = useDark();
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 10, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: color + "22", border: `2px solid ${color}`, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{step}</div>
        {step < total && <div style={{ width: 2, height: 20, background: dark ? "#334155" : "#e2e8f0", marginTop: 4 }} />}
      </div>
      <div style={{ background: dark ? "#1e293b" : "#f8fafc", borderRadius: 10, padding: "12px 16px", flex: 1, border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`, marginTop: 4 }}>
        <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{title}</div>
        <div style={{ color: dark ? "#94a3b8" : "#6b7280", fontSize: 12, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const dark = useDark();
  return (
    <details style={{ background: dark ? "#1e293b" : "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 10, border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`, cursor: "pointer" }}>
      <summary style={{ color: dark ? "#e2e8f0" : "#0f172a", fontWeight: 600, fontSize: 14, listStyle: "none", display: "flex", justifyContent: "space-between" }}>
        {q} <span style={{ color: "#6366f1" }}>+</span>
      </summary>
      <p style={{ color: dark ? "#94a3b8" : "#6b7280", fontSize: 13, lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>{a}</p>
    </details>
  );
}

function StepRow({ n, text }) {
  const dark = useDark();
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 12, alignItems: "flex-start" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#6366f1", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{n}</div>
      <p style={{ color: dark ? "#94a3b8" : "#475569", fontSize: 13, lineHeight: 1.7, margin: 0, paddingTop: 4 }}>{text}</p>
    </div>
  );
}

// ─── Section content ──────────────────────────────────────────────────────────
const sections = {
  overview: {
    label: "Overview",
    icon: <Book size={14} />,
    content: () => (
      <>
        <Section title="What is the AI Memory Engine SDK?">
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <Badge color="#6366f1">v1.0.1</Badge>
            <Badge color="#34d399">ESM Only</Badge>
            <Badge color="#fbbf24">ISC License</Badge>
          </div>
          <P>The <strong>AI Memory Engine SDK</strong> (<InlineCode>ai-memory-engine-sdk</InlineCode>) is a JavaScript client library that lets any application store, retrieve, and delete AI memory — persistent, semantically-searchable context for users — without managing any backend infrastructure.</P>
          <P>The SDK connects to the AI Memory Engine platform, which handles classification, embedding generation, storage routing, and memory lifecycle management automatically.</P>
          <P>The live backend gateway is hosted at <InlineCode>https://ai-memory-engine-6uby.onrender.com</InlineCode>.</P>
        </Section>
        <Section title="What Problem Does This Solve?">
          <P>Most AI models are stateless. Each conversation starts fresh with no memory of previous interactions. The AI Memory Engine solves this by giving your AI application a persistent memory layer.</P>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 20 }}>
            {[
              { icon: "💾", title: "Store", desc: "What a user says, prefers, or does during a session" },
              { icon: "🔍", title: "Retrieve", desc: "Context in future sessions, even days or weeks later" },
              { icon: "🗑️", title: "Delete", desc: "Memories when they are no longer relevant" },
              { icon: "⚡", title: "Auto-route", desc: "Short-term Redis or long-term MongoDB automatically" },
            ].map(c => <FeatureCard key={c.title} {...c} />)}
          </div>
        </Section>
        <Section title="How Memory Storage Works">
          <StorageCard label="Short-Term Memory" tag="Redis" color="#f87171" desc="Transient, session-level context. Fast to write and retrieve. Keyed with pattern mem:<appId>:<timestamp>." />
          <StorageCard label="Long-Term Memory" tag="MongoDB" color="#34d399" desc="Durable, persistent context. Stored with vector embedding, relevance score, frequency counter, and lastSeenAt timestamp." />
          <P>The routing decision is made automatically by the Python Classifier. You do not need to specify the storage tier.</P>
        </Section>
      </>
    ),
  },

  installation: {
    label: "Installation",
    icon: <Package size={14} />,
    content: () => (
      <>
        <Section title="Installation">
          <P>Install from npm using your preferred package manager.</P>
          <H3>npm</H3>
          <CodeBlock code="npm install ai-memory-engine-sdk" language="bash" />
          <H3>yarn</H3>
          <CodeBlock code="yarn add ai-memory-engine-sdk" language="bash" />
          <H3>pnpm</H3>
          <CodeBlock code="pnpm add ai-memory-engine-sdk" language="bash" />
          <InfoCard icon="⚠️" title="ESM Only" desc='The package uses "type": "module". Your project must use ES module syntax. For CommonJS, use a dynamic import() call instead of require().' />
        </Section>
        <Section title="Initialization">
          <P>Import the default export and instantiate it with your API key.</P>
          <CodeBlock code={`import AIMemoryClient from 'ai-memory-engine-sdk';\n\nconst client = new AIMemoryClient('your_api_key_here');`} />
          <P>The constructor throws immediately if no API key is provided.</P>
          <H3>Axios Instance Config</H3>
          <Table
            headers={["Setting", "Value"]}
            rows={[
              ["Base URL", "https://ai-memory-engine-6uby.onrender.com"],
              ["Timeout", "120,000 ms (2 minutes)"],
              ["x-api-key header", "Set automatically from constructor arg"],
              ["Content-Type", "application/json"],
            ]}
          />
        </Section>
        <Section title="Getting an API Key">
          {["Sign up or log in at the AI Memory Engine Dashboard.", "Click Create App in the navigation.", "Enter a name and optional description for your application.", "Your API key is generated and displayed immediately.", "Copy and store this key securely — shown only once."].map((step, i) => (
            <StepRow key={i} n={i + 1} text={step} />
          ))}
        </Section>
      </>
    ),
  },

  methods: {
    label: "SDK Methods",
    icon: <Code2 size={14} />,
    content: () => (
      <>
        <Section title="SDK Methods">
          <P>The SDK exposes three core async methods. All throw <InlineCode>Error</InlineCode> instances on failure.</P>
        </Section>
        <Section title="client.ingest()">
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <Badge color="#34d399">POST</Badge>
            <Badge color="#6366f1">Primary Write Operation</Badge>
          </div>
          <P>Stores a new memory for a given user.</P>
          <CodeBlock code="async ingest(userId: string, content: string, metadata?: object): Promise<object>" language="ts" />
          <H3>Parameters</H3>
          <Table
            headers={["Parameter", "Type", "Required", "Description"]}
            rows={[
              ["userId", "string", "Yes", "Unique identifier for the user (DB ID, Clerk ID, email, UUID)"],
              ["content", "string", "Yes", "Natural language text of the memory to store"],
              ["metadata", "object", "No", "Optional key-value pairs for additional context"],
            ]}
          />
          <H3>Returns</H3>
          <CodeBlock code={`{\n  message: "Memory processed successfully",\n  memoryId: "69ad7bb7af2212d9b502dce9",\n  type: "long-term"\n}`} />
          <H3>Example</H3>
          <CodeBlock code={`const result = await client.ingest(\n  'user_abc123',\n  'The user prefers Python over JavaScript for backend work.',\n  { source: 'onboarding', sessionId: 'sess_xyz' }\n);\n\nconsole.log(result.memoryId); // "69ad7bb7af2212d9b502dce9"\nconsole.log(result.type);     // "long-term"`} />
        </Section>
        <Section title="client.retrieve()">
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}><Badge color="#60a5fa">GET</Badge></div>
          <P>Retrieves a stored memory by its ID. Automatically detects Redis vs MongoDB backend.</P>
          <CodeBlock code="async retrieve(memoryId: string): Promise<object>" language="ts" />
          <H3>Returns</H3>
          <CodeBlock code={`{\n  message: "content found",\n  content: {\n    userId: "user_abc123",\n    content: "The user prefers Python...",\n    type: "long-term",\n    score: 0.87,\n    frequency: 1,\n    createdAt: "2026-03-12T..."\n  }\n}`} />
          <H3>Example</H3>
          <CodeBlock code={`const result = await client.retrieve('69ad7bb7af2212d9b502dce9');\nconsole.log(result.content.content); // "The user prefers Python..."\nconsole.log(result.content.score);   // 0.87`} />
        </Section>
        <Section title="client.delete()">
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}><Badge color="#f87171">DELETE</Badge></div>
          <P>Permanently deletes a memory by its ID from all storage backends.</P>
          <CodeBlock code="async delete(memoryId: string): Promise<object>" language="ts" />
          <H3>Returns</H3>
          <CodeBlock code={`{ success: true, message: "Memory successfully removed" }`} />
          <H3>Example</H3>
          <CodeBlock code={`const response = await client.delete('69ad7bb7af2212d9b502dce9');\nconsole.log(response.message); // "Memory successfully removed"`} />
        </Section>
        <Section title="API Gateway Routes">
          <Table
            headers={["SDK Method", "HTTP", "Route", "Service"]}
            rows={[
              ["client.ingest()", "POST", "/memory-service/memory", "Memory Service"],
              ["client.retrieve()", "GET", "/retrieval-service/retrieve-memory/:id", "Retrieval Service"],
              ["client.delete()", "DELETE", "/deletion-service/delete-memory/:id", "Deletion Service"],
            ]}
          />
        </Section>
      </>
    ),
  },

  datamodel: {
    label: "Data Model",
    icon: <Database size={14} />,
    content: () => (
      <>
        <Section title="Memory Data Model">
          <P>When a memory is stored in MongoDB (long-term), it has the following structure:</P>
          <Table
            headers={["Field", "Type", "Description"]}
            rows={[
              ["_id", "ObjectId", "Unique MongoDB identifier"],
              ["userId", "String", "The user this memory belongs to"],
              ["content", "String", "The raw text content of the memory"],
              ["type", "String", "Classified automatically by the Python service"],
              ["embedding", "Number[]", "Ollama-generated vector embedding for semantic search"],
              ["score", "Number", "Relevance score assigned by the scoring service"],
              ["appId", "String", "The application this memory belongs to"],
              ["frequency", "Number", "How many times this memory has been accessed"],
              ["lastSeenAt", "Date", "Last time this memory was accessed"],
              ["createdAt", "Date", "When the memory was first created"],
            ]}
          />
        </Section>
        <Section title="Memory Ingestion Pipeline">
          <P>When you call <InlineCode>client.ingest()</InlineCode>, the following happens internally:</P>
          {[
            { title: "API Gateway", color: "#6366f1", desc: "Validates x-api-key header, attaches appId to request context." },
            { title: "Memory Service", color: "#8b5cf6", desc: "Extracts userId, content, appId. Calls Python Classifier. Generates correlationId." },
            { title: "Python Classifier", color: "#a78bfa", desc: 'Returns a type label — "preference", "fact", "instruction", or "episodic".' },
            { title: "Event Bus", color: "#7c3aed", desc: "Receives MEMORY_INGESTED event with full payload including correlationId." },
            { title: "Embedding Service", color: "#6d28d9", desc: "Generates vector embedding using Ollama for semantic similarity search." },
            { title: "Storage Service", color: "#5b21b6", desc: "Persists to Redis (short-term) or MongoDB with full schema (long-term)." },
            { title: "Scoring Service", color: "#4c1d95", desc: "Assigns relevance score based on content characteristics." },
            { title: "Response", color: "#34d399", desc: "Memory Service returns memoryId and type to the caller via MessageBridge." },
          ].map((s, i, arr) => (
            <PipelineStep key={s.title} step={i + 1} total={arr.length} {...s} />
          ))}
        </Section>
      </>
    ),
  },

  examples: {
    label: "Usage Examples",
    icon: <Terminal size={14} />,
    content: () => (
      <>
        <Section title="Basic Usage">
          <CodeBlock code={`import AIMemoryClient from 'ai-memory-engine-sdk';\n\nconst client = new AIMemoryClient(process.env.MEMORY_API_KEY);\n\nconst result = await client.ingest('user_001', 'User works as a frontend developer.');\nconst memoryId = result.memoryId;\n\nconst memory = await client.retrieve(memoryId);\nconsole.log(memory.content.content); // "User works as a frontend developer."\n\nawait client.delete(memoryId);`} />
        </Section>
        <Section title="Integrating With an AI Chatbot">
          <P>Store every user message and AI response, building up persistent history to inject into future prompts.</P>
          <CodeBlock code={`import AIMemoryClient from 'ai-memory-engine-sdk';\nimport OpenAI from 'openai';\n\nconst memory = new AIMemoryClient(process.env.MEMORY_API_KEY);\nconst openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });\n\nasync function chat(userId, userMessage) {\n  await memory.ingest(userId, userMessage, {\n    type: 'user-message',\n    timestamp: new Date().toISOString()\n  });\n\n  const completion = await openai.chat.completions.create({\n    model: 'gpt-4o',\n    messages: [{ role: 'user', content: userMessage }]\n  });\n\n  const reply = completion.choices[0].message.content;\n\n  await memory.ingest(userId, reply, {\n    type: 'ai-response',\n    timestamp: new Date().toISOString()\n  });\n\n  return reply;\n}`} />
        </Section>
        <Section title="Batch Ingestion">
          <P>Store multiple memories at once using <InlineCode>Promise.all</InlineCode> — useful during onboarding.</P>
          <CodeBlock code={`const userFacts = [\n  'User is based in Mumbai, India.',\n  'User prefers TypeScript over JavaScript.',\n  'User works on a team of 5 engineers.',\n];\n\nconst results = await Promise.all(\n  userFacts.map(fact =>\n    client.ingest('user_456', fact, { source: 'onboarding' })\n  )\n);\n\nconsole.log(\`Stored \${results.length} memories.\`);`} />
        </Section>
        <Section title="Handling Cold Starts">
          <P>The backend may take up to 2 minutes to wake up. Use this retry helper:</P>
          <CodeBlock code={`async function ingestWithRetry(client, userId, content, retries = 3) {\n  for (let attempt = 1; attempt <= retries; attempt++) {\n    try {\n      return await client.ingest(userId, content);\n    } catch (error) {\n      const isTimeout = error.message.includes('waking up') ||\n                        error.message.includes('timeout');\n      if (isTimeout && attempt < retries) {\n        console.log(\`Attempt \${attempt} failed. Retrying in 5s...\`);\n        await new Promise(resolve => setTimeout(resolve, 5000));\n      } else {\n        throw error;\n      }\n    }\n  }\n}`} />
        </Section>
        <Section title="TypeScript Declarations">
          <P>The SDK ships as plain JS. Create this declaration file for full type safety:</P>
          <CodeBlock code={`declare module 'ai-memory-engine-sdk' {\n  export interface IngestResult {\n    message: string;\n    memoryId: string;\n    type: string;\n  }\n  export interface RetrieveResult {\n    message: string;\n    content: {\n      userId: string;\n      content: string;\n      type?: string;\n      score?: number;\n      [key: string]: unknown;\n    };\n  }\n  export default class AIMemoryClient {\n    constructor(apiKey: string);\n    ingest(userId: string, content: string, metadata?: object): Promise<IngestResult>;\n    retrieve(memoryId: string): Promise<RetrieveResult>;\n    delete(memoryId: string): Promise<{ success: boolean; message: string }>;\n  }\n}`} language="ts" />
        </Section>
      </>
    ),
  },

  security: {
    label: "Security & FAQ",
    icon: <Shield size={14} />,
    content: () => (
      <>
        <Section title="Security Considerations">
          <InfoCard icon="🔑" title="API Keys are Passwords" desc="Do not commit to source control. Use environment variables or a secrets manager." />
          <InfoCard icon="🚫" title="No Client-Side Keys" desc="Do not expose API keys in client-side JavaScript. Call the SDK from server-side or API routes only." />
          <InfoCard icon="🔄" title="Key Rotation" desc="If compromised, delete the associated App from the dashboard and create a new one." />
          <InfoCard icon="🔒" title="Proxy Pattern" desc="If calling from a frontend, proxy through your own API route that injects the key server-side." />
          <H3>Environment Variables</H3>
          <CodeBlock code={`# .env\nMEMORY_API_KEY=your_api_key_here\n\n# Next.js\nNEXT_PUBLIC_MEMORY_API_KEY=your_api_key_here\n\n# Vite\nVITE_MEMORY_API_KEY=your_api_key_here`} language="bash" />
        </Section>
        <Section title="Error Handling">
          <P>All three methods throw <InlineCode>Error</InlineCode> instances formatted as: <InlineCode>{"<Operation>"} Failed: {"<message>"}</InlineCode></P>
          <Table
            headers={["Error Message", "Cause"]}
            rows={[
              ["Ingestion Failed: Unauthorized - Invalid API Key", "Wrong or missing API key"],
              ["Ingestion Failed: Fields are missing", "userId or content not provided"],
              ["Retrieval Failed: Memory not found", "No memory with that ID"],
              ["Deletion Failed: Memory not found in any storage engine", "ID doesn't exist"],
              ["Ingestion Failed: Service is waking up...", "Cold-start timeout — retry after delay"],
            ]}
          />
          <CodeBlock code={`try {\n  const result = await client.ingest('user_123', 'User prefers dark mode.');\n} catch (error) {\n  if (error.message.includes('waking up')) {\n    await new Promise(resolve => setTimeout(resolve, 5000));\n  } else {\n    console.error(error.message);\n  }\n}`} />
        </Section>
        <Section title="Frequently Asked Questions">
          {[
            { q: "What is a userId and how should I set it?", a: "Any string that uniquely identifies a user — a database ID, Clerk user ID, email, or UUID. Keep it consistent across sessions. No registration step required." },
            { q: "What is the difference between short-term and long-term memory?", a: "Short-term lives in Redis — fast but ephemeral. Long-term lives in MongoDB with vector embeddings, scores, and timestamps. Classification is automatic." },
            { q: "How does semantic retrieval work?", a: "Long-term memories get Ollama-generated vector embeddings for semantic similarity search. The SDK currently exposes retrieval by ID only; semantic search is in the dashboard." },
            { q: "What memory types are there?", a: '"preference", "fact", "instruction", "episodic", and others. The type is returned in the ingest() response.' },
            { q: "What is the request timeout?", a: "120 seconds (2 minutes). Intentional for cold-start accommodation. If you see timeouts, wait a moment and retry." },
            { q: "Can I use this with any AI model?", a: "Yes. The SDK is model-agnostic — GPT-4, Claude, Gemini, or any other LLM." },
          ].map((faq, i) => <FaqItem key={i} {...faq} />)}
        </Section>
      </>
    ),
  },
};

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Documentation() {
  const { isDarkMode } = useTheme();
  const [active, setActive] = useState("overview");
  const ActiveContent = sections[active].content;

  // All theme tokens in one place — flip with isDarkMode
  const t = {
    bg:          isDarkMode ? "#020817"   : "#f8fafc",
    topbar:      isDarkMode ? "#020817dd" : "#ffffffdd",
    border:      isDarkMode ? "#1e293b"   : "#e2e8f0",
    textPrimary: isDarkMode ? "#f1f5f9"   : "#0f172a",
    textMuted:   isDarkMode ? "#475569"   : "#64748b",
    textFaint:   isDarkMode ? "#334155"   : "#cbd5e1",
    cardBg:      isDarkMode ? "#1e293b"   : "#f1f5f9",
    cardBg2:     isDarkMode ? "#0f172a"   : "#f8fafc",
  };

  return (
    <DarkCtx.Provider value={isDarkMode}>
      <div style={{ minHeight: "100vh", background: t.bg, color: t.textPrimary, fontFamily: "'Inter','Segoe UI',sans-serif", transition: "background 0.25s, color 0.25s" }}>

        {/* Top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: t.topbar, backdropFilter: "blur(12px)", borderBottom: `1px solid ${t.border}`, padding: "0 32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Book size={14} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, color: t.textPrimary }}>AI Memory Engine</span>
              <span style={{ color: t.textMuted, fontSize: 13, marginLeft: 4 }}>SDK Docs</span>
              <Badge color="#6366f1">v1.0.1</Badge>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="https://github.com/RohitBCA456/ai-memory-engine" target="_blank" rel="noopener noreferrer" style={{ color: t.textMuted, fontSize: 12, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                <GitBranch size={13} /> GitHub <ExternalLink size={10} />
              </a>
              <a href="https://www.npmjs.com/package/ai-memory-engine-sdk" target="_blank" rel="noopener noreferrer" style={{ color: t.textMuted, fontSize: 12, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                <Package size={13} /> npm <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px", display: "flex", gap: 40 }}>

          {/* Sidebar */}
          <aside style={{ width: 220, flexShrink: 0 }}>
            <div style={{ position: "sticky", top: 80 }}>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 800, marginBottom: 16 }}>Navigation</div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {Object.entries(sections).map(([key, sec]) => (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    style={{
                      background: active === key ? "#6366f111" : "transparent",
                      border: active === key ? "1px solid #6366f133" : `1px solid transparent`,
                      borderRadius: 8, padding: "9px 12px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8, textAlign: "left",
                      color: active === key ? "#818cf8" : t.textMuted,
                      fontSize: 13, fontWeight: active === key ? 700 : 500,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ color: active === key ? "#818cf8" : t.textMuted }}>{sec.icon}</span>
                    {sec.label}
                    {active === key && <ChevronRight size={12} style={{ marginLeft: "auto" }} />}
                  </button>
                ))}
              </nav>

              {/* Install card */}
              <div style={{ marginTop: 28, background: t.cardBg, borderRadius: 12, padding: 16, border: `1px solid ${t.border}` }}>
                <div style={{ color: "#6366f1", fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <Terminal size={12} /> Install
                </div>
                <code style={{ fontSize: 11, color: "#a78bfa", fontFamily: "'JetBrains Mono','Fira Code',monospace", wordBreak: "break-all" }}>
                  npm i ai-memory-engine-sdk
                </code>
              </div>

              {/* Quick links card */}
              <div style={{ marginTop: 16, background: t.cardBg2, borderRadius: 12, padding: 16, border: `1px solid ${t.border}` }}>
                <div style={{ color: "#34d399", fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <Zap size={12} /> Quick Links
                </div>
                {[
                  { label: "Dashboard", href: "https://ai-memory-engine-6uby.onrender.com" },
                  { label: "GitHub", href: "https://github.com/RohitBCA456/ai-memory-engine" },
                  { label: "npm", href: "https://www.npmjs.com/package/ai-memory-engine-sdk" },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, color: t.textMuted, fontSize: 12, textDecoration: "none", padding: "3px 0" }}>
                    <ExternalLink size={10} /> {l.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32, fontSize: 12, color: t.textMuted }}>
              <span>Docs</span>
              <ChevronRight size={12} />
              <span style={{ color: "#818cf8" }}>{sections[active].label}</span>
            </div>

            <div key={active} style={{ animation: "fadeIn 0.2s ease" }}>
              <ActiveContent />
            </div>

            {/* Footer */}
            <div style={{ marginTop: 60, paddingTop: 24, borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: t.textFaint, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <span>© 2026 AI Memory Engine · ISC License</span>
              <span>Author: Rohit Yadav</span>
            </div>
          </main>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
          * { box-sizing: border-box; }
          @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
          details summary::-webkit-details-marker { display: none; }
          strong { color: ${isDarkMode ? "#e2e8f0" : "#0f172a"}; }
          a { color: #818cf8; }
        `}</style>
      </div>
    </DarkCtx.Provider>
  );
}
