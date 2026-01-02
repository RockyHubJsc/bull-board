import { RedisOptions } from "ioredis";

export interface BoardConfig {
  router: string;
  redisConfig: RedisOptions;
  readOnlyMode?: boolean;
}
