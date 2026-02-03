import { EVENTS } from "./event.js";
import { getChannel } from "./rabbitmq.js";

export async function consumeEvent(queue, handler) {
  const channel = await getChannel();
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    await handler(data);

    channel.ack(msg);
  });
}