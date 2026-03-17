import "dotenv/config";
import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
const PINE_HOST = process.env.PINECONE_HOST;
const PINE_API_KEY = process.env.PINECONE_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

async function getEmbedding(text) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const output = await hf.featureExtraction({
        model: "BAAI/bge-small-en-v1.5",
        inputs: text,
      });

      const vector = Array.isArray(output[0]) ? output[0] : output;
      if (!vector || typeof vector[0] !== "number")
        throw new Error("Invalid embedding format");
      return Array.from(vector);
    } catch (err) {
      if (
        err.message?.toLowerCase().includes("loading") &&
        attempt < maxRetries
      ) {
        await new Promise((r) => setTimeout(r, 20000));
        continue;
      }
      if (
        (err.message?.includes("429") || err.message?.includes("rate")) &&
        attempt < maxRetries
      ) {
        await new Promise((r) => setTimeout(r, attempt * 8000));
        continue;
      }
      throw err;
    }
  }
}

async function queryPinecone(vector, topK = 4) {
  const response = await fetch(`${PINE_HOST}/query`, {
    method: "POST",
    headers: { "Api-Key": PINE_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      vector,
      topK,
      includeMetadata: true,
      namespace: "",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Pinecone query failed: ${err.message || response.statusText}`,
    );
  }
  return response.json();
}

async function generateAnswer(question, context) {
  if (GEMINI_KEY) {
    try {
      const prompt = `You are DocBot, a helpful assistant for the AI Memory Engine SDK.
Answer using ONLY the context below. If the answer is not in the context, say "I don't have that information in the docs."
Be concise. Use backticks for code. Never invent API methods not in the context.

Context:
${context}

Question: ${question}
Answer:`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
          }),
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          `Gemini error: ${body?.error?.message || res.statusText}`,
        );
      }

      const data = await res.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No answer generated."
      );
    } catch (error) {
      console.error("Gemini fallback triggered due to error:", error.message);
    }
  }

  const response = await hf.chatCompletion({
    model: "Qwen/Qwen2.5-7B-Instruct",
    messages: [
      {
        role: "system",
        content:
          "You are DocBot. Answer only from context. If not found, say 'Information not available'.",
      },
      {
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${question}`,
      },
    ],
    max_tokens: 512,
    temperature: 0.1,
  });

  return (
    response.choices?.[0]?.message?.content?.trim() ?? "No answer generated."
  );
}

export const askDocs = async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "query is required" });
  }

  try {
    const queryVector = await getEmbedding(query.trim());

    const result = await queryPinecone(queryVector, 4);

    if (!result.matches || result.matches.length === 0) {
      return res.status(200).json({
        success: true,
        answer: "I couldn't find anything relevant in the documentation.",
        sources: [],
        score: 0,
      });
    }

    const context = result.matches
      .map((m, i) => `[${i + 1}] ${m.metadata.text}`)
      .join("\n\n---\n\n");

    const sources = [
      ...new Set(
        result.matches
          .map((m) => m.metadata.section || m.metadata.source)
          .filter(Boolean),
      ),
    ];

    const answer = await generateAnswer(query.trim(), context);

    return res.status(200).json({
      success: true,
      answer,
      sources,
      score: result.matches[0]?.score ?? 0,
    });
  } catch (err) {
    console.error("RAG error:", err.message);

    if (err.message?.includes("429") || err.message?.includes("rate")) {
      return res.status(429).json({
        success: false,
        error: "Rate limit hit — try again in a few seconds.",
      });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};
