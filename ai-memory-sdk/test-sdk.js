import AIMemoryClient from "./index.js";

// Initialize with only the API Key
const client = new AIMemoryClient(
  "30a1c19fa222a31ac15f5f5af7490d6023f1c68aa20d050947f9f783f7c40d0f",
);

async function runTest() {
  console.log("Starting SDK Final Test...");
  try {
    console.log("📥 Testing Ingestion...");
    const ingestResult = await client.ingest(
      "69c407c893c229fd302cb821",
      "I work at hcl as a software developer",
    );
    console.log(
      "✅ Ingest Success:",
      ingestResult.success || "Result received",
    );

    console.log("Testing Retrieval...");
    const retrieveResult = await client.retrieve("69c407c893c229fd302cb821", "do you know where i work at?");
    console.log("Retrieval Success, Data: ", retrieveResult);
  } catch (error) {
    console.error("Test Failed:", error.message);
    process.exit(1);
  }
}
runTest();
