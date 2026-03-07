import amqp from "amqplib";
import dotenv from "dotenv";
import { EVENTS } from "./event.js";

dotenv.config({ path: "../.env" });

let channel;

export async function getChannel() {
  if (channel) return channel;

  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  return channel;
}

export async function clearQueue() {
  const channel = await getChannel();
  await channel.purgeQueue(EVENTS.MEMORY_SCORED);
}
