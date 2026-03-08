import AIMemoryClient from "./index.js";

// Initialize with only the API Key
const client = new AIMemoryClient(
  "cb7202a9c8ce550edd5e164def593d6ef1db27189a979ba9faed97510f046983",
);

async function runTest() {
  console.log("🚀 Starting SDK Final Test...");
  try {
    console.log("📥 Testing Ingestion...");
    const ingestResult = await client.ingest(
      "user_test_123",
      "Testing the hardcoded gateway SDK.",
    );
    console.log(
      "✅ Ingest Success:",
      ingestResult.success || "Result received",
    );

    // Test Retrieval with a known ID from your DB
    console.log("🔍 Testing Retrieval...");
    const retrieveResult = await client.retrieve("69ad7bb7af2212d9b502dce9");
    console.log("✅ Retrieval Success");
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
    process.exit(1);
  }
}
runTest();
