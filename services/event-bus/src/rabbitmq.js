import amqp from "amqplib";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { EVENTS } from "./event.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

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