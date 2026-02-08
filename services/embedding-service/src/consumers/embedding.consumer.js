import { consumeEvent } from "../../../event-bus/src/consumer.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import { getEmbedding } from "../adapters/llm.adapter.js";
import { publishgMemoryEmbedding } from "../adapters/event.publisher.js";

export async function consumeMemoryIngest() {
  await consumeEvent(EVENTS.MEMORY_INGESTED, async (data) => {

    console.log("Received memory for embedding:", data);

    if (data && data.content) {
      const embeddingArray = await getEmbedding(data.content);

      const memory = {
        ...data,
        embedding: embeddingArray,
      };

      await publishgMemoryEmbedding(EVENTS.EMBEDDING_CREATED, memory);
    } else {
      console.error("Received message with no content:", data);
    }
  });
}
