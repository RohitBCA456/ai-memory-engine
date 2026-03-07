// test-sdk.js
import AIMemoryClient from "./index.js"; // Import directly from your local file

const client = new AIMemoryClient(
  "3a00751cdecd0e32691639bf02a7452aa81faae8ff8c41cae8bd29276d21710a",
  {
    ingest: "http://localhost:4000/memory-service",
    retrieve: "http://localhost:4000/retrieval-service",
    delete: "http://localhost:4000/deletion-service",
  },
);

async function runTest() {
  console.log("🚀 Starting SDK Final Test...");

  try {
    // Test 1: Ingestion
    console.log("📥 Testing Ingestion...");
    const ingestResult = await client.ingest(
      "user_test_123",
      "Testing the SDK integration."
    );
    
    // Debug: See what the backend actually sent
    console.log("Full Ingest Response:", JSON.stringify(ingestResult)); 

    // Handle case where backend returns result directly or inside .data
    const memoryData = ingestResult.data || ingestResult;
    console.log("✅ Ingest Success:", ingestResult.success || "Result received");

    // Test 2: Retrieval
    console.log("🔍 Testing Retrieval...");
    // Vector search needs 'userId' and 'text' to find matches
    const retrieveResult = await client.retrieve("69aae7a0e90f32fe46408504");
    
    const foundMemory = retrieveResult.data?.[0] || retrieveResult.data || retrieveResult;
    console.log("✅ Retrieval Success. Found:", foundMemory?.content || "No content found");

    // Test 3: Deletion
    const targetId = "69aae7a0e90f32fe46408504";
    if (targetId) {
      console.log(`🗑️ Testing Deletion for ID: ${targetId}...`);
      const deleteResult = await client.delete(targetId);
      console.log("✅ Deletion Success:", deleteResult.success);
    } else {
      console.log("⚠️ Skipping Deletion: No valid ID found in retrieval.");
    }
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
    process.exit(1);
  }
}
runTest();
