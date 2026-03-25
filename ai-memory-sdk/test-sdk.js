import AIMemoryClient from "./index.js";

// Initialize with only the API Key
const client = new AIMemoryClient(
  "cb7202a9c8ce550edd5e164def593d6ef1db27189a979ba9faed97510f046983",
);

async function runTest() {
  console.log("Starting SDK Final Test...");
  try {
    console.log("📥 Testing Ingestion...");
    const ingestResult = await client.ingest(
      "69ad631cb4d96dc4cad9e2e1",
      "I work at hcl as a software developer",
    );
    console.log(
      "✅ Ingest Success:",
      ingestResult.success || "Result received",
    );

    console.log("Testing Retrieval...");
    const retrieveResult = await client.retrieve("69ad631cb4d96dc4cad9e2e1", "do you know where i work at?");
    console.log("Retrieval Success, Data: ", retrieveResult);
  } catch (error) {
    console.error("Test Failed:", error.message);
    process.exit(1);
  }
}
runTest();
