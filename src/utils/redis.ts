import { Redis, RedisOptions } from "ioredis";

const redisClients = new Map<string, Redis>();

function getRedisConfigKey(config: RedisOptions): string {
  const host = config.host || "localhost";
  const port = config.port || 6379;
  const db = config.db || 0;
  const username = config.username || "";
  const path = config.path || "";
  const keyPrefix = config.keyPrefix || "";
  return `${host}:${port}:${db}:${username}:${path}:${keyPrefix}`;
}

export function getRedisClient(config: RedisOptions): Redis {
  const key = getRedisConfigKey(config);
  let client = redisClients.get(key);

  if (!client) {
    client = new Redis({
      ...config,
      maxRetriesPerRequest: null, // Required when sharing connections across BullMQ queues
      enableReadyCheck: false,
    });

    client.on("error", (err) => {
      console.error(`[Redis Error] (${key}):`, err.message);
    });

    redisClients.set(key, client);
  }

  return client;
}

export async function getQueueKeys(
  redisOrConfig: Redis | RedisOptions,
): Promise<string[]> {
  const redis =
    redisOrConfig instanceof Redis
      ? redisOrConfig
      : getRedisClient(redisOrConfig);

  try {
    const keys = await redis.keys("bull:*");
    return [...new Set(keys.map((key) => key.split(":")[1]))].sort();
  } catch (err) {
    console.error("Error fetching queue keys:", err);
    return [];
  }
}

export async function closeAllRedisConnections(): Promise<void> {
  const clients = Array.from(redisClients.values());
  redisClients.clear();
  await Promise.allSettled(clients.map((client) => client.quit()));
}

