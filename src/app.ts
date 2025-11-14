import chalk from "chalk";
import { Client } from "discord.js";
import express from "express";

export async function createApp(
  client: Client<true>,
  config: { port: number; botToken: string; password: string },
) {
  const start = performance.now();
  const app = express();

  app.use(express.json());

  // 🔒 Protect all /api routes
  app.use("/api", (req, res, next) => {
    const headerPass = req.headers.password;
    const queryPass = req.query.password;

    const valid =
      headerPass === config.password || queryPass === config.password;
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    next();
  });

  app.listen(config.port, () => {
    const bootTime = performance.now() - start;

    console.log(chalk.blueBright("✔ API Server Started"));
    console.log(
      chalk.gray(" ├─") +
        chalk.white(" Port:          ") +
        chalk.cyan(config.port.toString()),
    );
    console.log(
      chalk.gray(" └─") +
        chalk.white(" Boot Time:     ") +
        chalk.magenta(`${bootTime}ms\n`),
    );
  });

  return app;
}
