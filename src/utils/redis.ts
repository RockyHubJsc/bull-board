import { Redis, RedisOptions } from "ioredis";

export async function getQueueKeys(
  redisConfig: RedisOptions,
): Promise<string[]> {
  const redis = new Redis(redisConfig);
  try {
    const keys = await redis.keys("bull:*");
    return [...new Set(keys.map((key) => key.split(":")[1]))].sort();
  } catch (err) {
    console.error("Error fetching queue keys:", err);
    return [];
  } finally {
    await redis.quit();
  }
}
