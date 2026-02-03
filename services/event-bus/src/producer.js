import { getChannel } from "./rabbitmq.js";

export async function publishEvent(queue, payload) {

  const channel = await getChannel();
  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
}
