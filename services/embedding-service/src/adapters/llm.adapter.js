import axios from "axios";

export async function getEmbedding(text, isQuery = false) {

  const prefix = isQuery ? "search_query: " : "search_document: ";
  const input = `${prefix}${text}`;

  const res = await axios.post("http://localhost:11434/api/embeddings", {
    model: "nomic-embed-text",
    prompt: input,
  });

  return res.data.embedding;
}