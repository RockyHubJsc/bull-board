import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { Queue as QueueMQ } from "bullmq";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "./auth/googleStrategy";
import { loadBoardConfigs } from "./config/boards";
import { isAuthenticated } from "./middleware/authMiddleware";
import authRoutes from "./routes/auth";
import { getQueueKeys } from "./utils/redis";
import { renderDashboard } from "./views/dashboard";

dotenv.config();

const PORT = process.env.PORT || 7712;
const boardConfigs = loadBoardConfigs();

(async () => {
  try {
    const app = express();
    app.set("trust proxy", 1); // if behind a proxy (Nginx, Cloudflare, etc.)
    app.use(morgan("dev"));
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === "production", // set to true in production
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

      const queueKeys = await getQueueKeys(config.redisConfig);
      console.log(
        `[${config.router}] Found ${queueKeys.length} queue(s):`,
        queueKeys,
      );

      const queues = queueKeys.map(
        (name) =>
          new BullMQAdapter(
            new QueueMQ(name, { connection: config.redisConfig }),
            { readOnlyMode: config.readOnlyMode },
          ),
      );

      createBullBoard({ queues, serverAdapter });
      app.use(config.router, isAuthenticated, serverAdapter.getRouter());
    }

    app.get("/healthz", (_req, res) => res.status(200).send("OK"));

    app.get("/", isAuthenticated, (req, res) => {
      const user = req.user as any;
      res.send(renderDashboard(user, boardConfigs));
    });

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 Bull Board UIs:`);
      boardConfigs.forEach((cfg) => {
        const mode = cfg.readOnlyMode ? "[READ-ONLY]" : "";
        console.log(`   • http://localhost:${PORT}${cfg.router} ${mode}`);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
