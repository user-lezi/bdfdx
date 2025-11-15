import chalk from "chalk";
import { Client } from "discord.js";
import { CONFIG } from "./config";
import { createApp } from "./app";

// Create a client instance
const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildBans"],
});

// Once the client is ready, do bot details log and run the express code
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

  function fetchStuff() {
    // Ensure application data is fresh
    client.application!.fetch();
    client.application!.commands.fetch();
  }
  fetchStuff();
  setInterval(fetchStuff, 600000);

  createApp(client as Client<true>, CONFIG);
});

client.login(CONFIG.botToken);
