import AIMemoryClient from "./index.js";

// Initialize with only the API Key
const client = new AIMemoryClient(
  "YOUR_API_KEY",
);

async function runTest() {
  console.log("🚀 Starting SDK Final Test...");
  try {
    console.log("📥 Testing Ingestion...");
    const ingestResult = await client.ingest(
      "user_id",
      "I work a hcl",
    );
    console.log(
      "✅ Ingest Success:",
      ingestResult.success || "Result received",
    );

    // Test Retrieval with a known ID from your DB
    console.log("🔍 Testing Retrieval...");
    const retrieveResult = await client.retrieve("user_id");
    console.log("✅ Retrieval Success");
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
    process.exit(1);
  }
}
runTest();
