import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const client = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN);

export async function getEmbedding(text, isQuery = false) {
  try {
    const prefix = isQuery
      ? "Represent this sentence for searching relevant passages: "
      : "";

    const input = `${prefix}${text}`;

    const output = await client.featureExtraction({
      model: "BAAI/bge-base-en-v1.5",
      inputs: input,
    });

    const vector = Array.isArray(output[0]) ? output[0] : output;

    if (!vector || vector.length === 0)
      throw new Error("Empty vector received");

    return vector;
  } catch (error) {
    console.error("HF SDK Error:", error.message);

    return new Array(768).fill(0);
  }
}
