import "dotenv/config";
import { InferenceClient } from "@huggingface/inference";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// ── Embed via HF ──────────────────────────────────────────────────────────────
async function getEmbedding(text, label) {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const output = await hf.featureExtraction({
                model: "BAAI/bge-small-en-v1.5", 
                inputs: text,
            });
            const vector = Array.isArray(output[0]) ? output[0] : output;
            if (!vector || typeof vector[0] !== "number") throw new Error("Invalid format");
            return vector;
        } catch (err) {
            if (err.message?.toLowerCase().includes("loading") && attempt < maxRetries) {
                console.log(`\n ⚠️ Model loading... waiting 20s (attempt ${attempt})`);
                await new Promise(r => setTimeout(r, 20000));
                continue;
            }
            throw err;
        }
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function runIngestion() {
    console.log("\n🚀 Starting Native REST Ingestion...\n");

    const rawText = fs.readFileSync(path.join(__dirname, "Docs.md"), "utf8");
    const rawChunks = rawText.split(/\n\n+/).filter(c => c.trim().length > 0);
    const allVectors = [];

    // 1. Generate Vectors
    for (let i = 0; i < rawChunks.length; i++) {
        process.stdout.write(`🧠 Embedding chunk ${i + 1}/${rawChunks.length}...`);
        try {
            const values = await getEmbedding(rawChunks[i], `chunk ${i+1}`);
            allVectors.push({
                id: `doc-${Date.now()}-${i}`,
                values: Array.from(values), // Ensure plain array
                metadata: { text: rawChunks[i], source: "Docs.md" }
            });
            process.stdout.write(" ✓\n");
        } catch (err) {
            process.stdout.write(` ✗ ${err.message}\n`);
        }
        await new Promise(r => setTimeout(r, 800));
    }

    if (allVectors.length === 0) return console.error("❌ No vectors created.");

    // 2. REST API Upsert (Bypasses SDK Validator)
    // Your Host URL looks like: https://your-index-name-xxxx.svc.us-east1-gcp.pinecone.io
    const PINE_HOST = process.env.PINECONE_HOST; 
    const BATCH_SIZE = 50;

    console.log(`\n📡 Sending ${allVectors.length} vectors to Pinecone via REST...`);

    for (let i = 0; i < allVectors.length; i += BATCH_SIZE) {
        const batch = allVectors.slice(i, i + BATCH_SIZE);
        
        const response = await fetch(`${PINE_HOST}/vectors/upsert`, {
            method: 'POST',
            headers: {
                'Api-Key': process.env.PINECONE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                vectors: batch,
                namespace: "" // Use your namespace if needed
            })
        });

        if (response.ok) {
            const resData = await response.json();
            console.log(` ✅ Batch ${Math.floor(i/BATCH_SIZE)+1} Success: ${resData.upsertedCount} vectors.`);
        } else {
            const errorData = await response.json();
            console.error(` ❌ Batch Failed:`, JSON.stringify(errorData));
            process.exit(1);
        }
    }

    console.log("\n✨ Ingestion Complete!");
}

runIngestion().catch(console.error);