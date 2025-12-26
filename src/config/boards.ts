import { BoardConfig } from "../types";

export function loadBoardConfigs(): BoardConfig[] {
  const configs: BoardConfig[] = [];
  let idx = 1;

  while (process.env[`BOARD_ROUTER_${idx}`]) {
    const router = process.env[`BOARD_ROUTER_${idx}`];
    configs.push({
      router: router!,
      redisConfig: {
        host: process.env[`REDIS_HOST_${idx}`] || "localhost",
        port: parseInt(process.env[`REDIS_PORT_${idx}`] || "6379"),
        db: parseInt(process.env[`REDIS_DB_${idx}`] || String(idx)),
        password: process.env[`REDIS_PASSWORD_${idx}`],
      },
      readOnlyMode: process.env[`READ_ONLY_MODE_${idx}`] === "true",
    });
    idx++;
  }

  if (configs.length === 0) {
    configs.push(
      {
        router: "/board1",
        redisConfig: { host: "localhost", port: 6379, db: 1 },
        readOnlyMode: false,
      },
      {
        router: "/board2",
        redisConfig: { host: "localhost", port: 6379, db: 2 },
        readOnlyMode: false,
      },
    );
  }

  return configs;
}
