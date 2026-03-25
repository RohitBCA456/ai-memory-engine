import "dotenv/config";
import { InferenceClient } from "@huggingface/inference";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

async function getEmbedding(text) {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const output = await hf.featureExtraction({
                model: "BAAI/bge-small-en-v1.5",
                inputs: text,
            });
            const vector = Array.isArray(output[0]) ? output[0] : output;
            if (!vector || typeof vector[0] !== "number") throw new Error("Invalid embedding format");
            return vector;
        } catch (err) {
            if (err.message?.toLowerCase().includes("loading") && attempt < maxRetries) {
                console.log(`Model loading... retrying in 20s (attempt ${attempt}/${maxRetries})`);
                await new Promise(r => setTimeout(r, 20000));
                continue;
            }
            throw err;
        }
    }
}

async function runIngestion() {
    console.log("\nStarting Ingestion...\n");

    // Split docs using RecursiveCharacterTextSplitter
    const rawText = fs.readFileSync(path.join(__dirname, "Docs.md"), "utf8");

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,       // max characters per chunk
        chunkOverlap: 50,     // overlap between chunks to preserve context
    });

    const chunks = await splitter.splitText(rawText);
    console.log(`Split into ${chunks.length} chunks\n`);

    // Embed each chunk
    const allVectors = [];

    for (let i = 0; i < chunks.length; i++) {
        process.stdout.write(`Embedding chunk ${i + 1}/${chunks.length}...`);
        try {
            const values = await getEmbedding(chunks[i]);
            allVectors.push({
                id: `doc-${Date.now()}-${i}`,
                values: Array.from(values),
                metadata: { text: chunks[i], source: "Docs.md" },
            });
            process.stdout.write(" ✓\n");
        } catch (err) {
            process.stdout.write(` ✗ ${err.message}\n`);
        }
        await new Promise(r => setTimeout(r, 800));
    }

    if (allVectors.length === 0) return console.error("\nNo vectors created. Aborting.");

    // Upsert to Pinecone in batches via REST
    const BATCH_SIZE = 50;
    console.log(`\nUpserting ${allVectors.length} vectors to Pinecone...\n`);

    for (let i = 0; i < allVectors.length; i += BATCH_SIZE) {
        const batch = allVectors.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;

        const response = await fetch(`${process.env.PINECONE_HOST}/vectors/upsert`, {
            method: "POST",
            headers: {
                "Api-Key": process.env.PINECONE_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ vectors: batch, namespace: "" }),
        });

        if (response.ok) {
            const { upsertedCount } = await response.json();
            console.log(`Batch ${batchNum}: ${upsertedCount} vectors upserted`);
        } else {
            const error = await response.json();
            console.error(`Batch ${batchNum} failed:`, JSON.stringify(error));
            process.exit(1);
        }
    }

    console.log("\nIngestion complete!\n");
}

runIngestion().catch(console.error);