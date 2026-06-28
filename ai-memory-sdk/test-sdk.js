import AIMemoryClient from "./index.js";

const client = new AIMemoryClient(
  "923133efbb844df3b9e13c8eb4f40f96cfcc36beb1bdf664d66b39fab744222e",
);

async function runTest() {
  console.log("Starting SDK Final Test...");
  try {
    console.log("Testing Ingestion...");
    const ingestResult = await client.ingest(
      "69c407c893c229fd302cb821",
      "I work at hcl as a software developer",
    );
    console.log("Ingest Success:", ingestResult.success || "Result received");

    console.log("Testing Retrieval...");
    const retrieveResult = await client.retrieve(
      "69c407c893c229fd302cb821",
      "do you know where i work at?",
    );
    console.log("Retrieval Success, Data: ", retrieveResult);
  } catch (error) {
    console.error("Test Failed:", error.message);
    process.exit(1);
  }
}
runTest();
