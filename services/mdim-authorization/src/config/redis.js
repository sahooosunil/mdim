import { createClient } from "redis";

export function createRedisClient(url) {
  const client = createClient({ url });
  client.on("error", (err) => console.error("Redis Error:", err));
  return client;
}
