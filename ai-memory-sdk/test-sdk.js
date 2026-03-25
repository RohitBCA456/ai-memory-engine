import AIMemoryClient from "./index.js";

// Initialize with only the API Key
const client = new AIMemoryClient(
  "YOUR_API_KEY",
);

async function runTest() {
  console.log("Starting SDK Final Test...");
  try {
    console.log("📥 Testing Ingestion...");
    const ingestResult = await client.ingest(
      "user_id",
      "I work at hcl as a software developer",
    );
    console.log(
      "✅ Ingest Success:",
      ingestResult.success || "Result received",
    );

    console.log("Testing Retrieval...");
    const retrieveResult = await client.retrieve("user_id", "do you know where i work at?");
    console.log("Retrieval Success, Data: ", retrieveResult);
  } catch (error) {
    console.error("Test Failed:", error.message);
    process.exit(1);
  }
}
runTest();
