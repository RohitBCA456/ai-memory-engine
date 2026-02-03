import { publishEvent } from "../../../event-bus/src/producer.js";
import { EVENTS } from "../../../event-bus/src/event.js";

export async function publishMemoryIngested(event, memory) {
  await publishEvent(event, {
    userId: memory.userId,
    content: memory.content,
    type: memory.type,
    createdAt: memory.createdAt,
  });
}
