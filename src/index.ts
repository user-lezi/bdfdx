import chalk from "chalk";
import { Client } from "discord.js";
import { CONFIG } from "./config";
import { createApp } from "./app";

const client = new Client({
  intents: ["Guilds"],
});

client.once("clientReady", () => {
  console.log("\n" + chalk.greenBright("✔ Discord Bot Connected"));
  console.log(
    chalk.gray(" ├─") +
      chalk.white(" Logged in as: ") +
      chalk.cyan(`${client.user!.tag}`),
  );
  console.log(
    chalk.gray(" ├─") +
      chalk.white(" Bot ID:     ") +
      chalk.cyan(`${client.user!.id}`),
  );
  console.log(
    chalk.gray(" └─") +
      chalk.white(" Guild Count: ") +
      chalk.cyan(`${client.guilds.cache.size}\n`),
  );

  createApp(client as Client<true>, CONFIG);
});

client.login(CONFIG.botToken);
