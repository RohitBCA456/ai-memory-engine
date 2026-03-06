import { publishEvent } from "../../../event-bus/src/producer.js";

export async function publishMemoryIngested(event, memory) {
  await publishEvent(event, {
    userId: memory.userId,
    content: memory.content,
    appId: memory.appId,
    correlationId: memory.correlationId,
    type: memory.type,
    createdAt: memory.createdAt,
  });
}
