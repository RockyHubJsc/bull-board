import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { RedisMetricsHistoryProvider } from "@bull-board/metrics";
import { Queue as QueueMQ } from "bullmq";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "./auth/googleStrategy";
import { loadBoardConfigs } from "./config/boards";
import { isAuthenticated } from "./middleware/authMiddleware";
import authRoutes from "./routes/auth";
import {
  closeAllRedisConnections,
  getQueueKeys,
  getRedisClient,
} from "./utils/redis";
import { renderDashboard } from "./views/dashboard";

dotenv.config();

const PORT = process.env.PORT || 7712;
const boardConfigs = loadBoardConfigs();

(async () => {
  try {
    const app = express();
    app.use(morgan("dev"));
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use(authRoutes);

    console.log(`Loading ${boardConfigs.length} board configuration(s)...`);

    // Setup each Bull Board instance
    for (const config of boardConfigs) {
      const serverAdapter = new ExpressAdapter();
      serverAdapter.setBasePath(config.router);

      const redisClient = getRedisClient(config.redisConfig);
      const queueKeys = await getQueueKeys(redisClient);
      console.log(
        `[${config.router}] Found ${queueKeys.length} queue(s):`,
        queueKeys,
      );

      const queues = queueKeys.map(
        (name) =>
          new BullMQAdapter(
            new QueueMQ(name, { connection: redisClient as any }),
            { readOnlyMode: config.readOnlyMode },
          ),
      );

      createBullBoard({
        queues,
        serverAdapter,
        options: {
          uiConfig: { showMetrics: true },
          historyProvider: new RedisMetricsHistoryProvider({
            connection: redisClient,
          }),
        },
      });
      app.use(config.router, isAuthenticated, serverAdapter.getRouter());
    }

    app.get("/healthz", (_req, res) => res.status(200).send("OK"));

    app.get("/", isAuthenticated, (req, res) => {
      const user = req.user as any;
      res.send(renderDashboard(user, boardConfigs));
    });

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 Bull Board UIs:`);
      boardConfigs.forEach((cfg) => {
        const mode = cfg.readOnlyMode ? "[READ-ONLY]" : "";
        console.log(`   • http://localhost:${PORT}${cfg.router} ${mode}`);
      });
    });

    const handleShutdown = async (signal: string) => {
      console.log(
        `\nReceived ${signal}, closing server and Redis connections...`,
      );
      server.close(async () => {
        await closeAllRedisConnections();
        console.log("Redis connections closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
