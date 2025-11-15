"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const app_1 = require("./app");
// Create a client instance
const client = new discord_js_1.Client({
    intents: ["Guilds"],
});
// Once the client is ready, do bot details log and run the express code
client.once("clientReady", () => {
    console.log("\n" + chalk_1.default.greenBright("✔ Discord Bot Connected"));
    console.log(chalk_1.default.gray(" ├─") +
        chalk_1.default.white(" Logged in as: ") +
        chalk_1.default.cyan(`${client.user.tag}`));
    console.log(chalk_1.default.gray(" ├─") +
        chalk_1.default.white(" Bot ID:     ") +
        chalk_1.default.cyan(`${client.user.id}`));
    console.log(chalk_1.default.gray(" └─") +
        chalk_1.default.white(" Guild Count: ") +
        chalk_1.default.cyan(`${client.guilds.cache.size}\n`));
    function fetchStuff() {
        // Ensure application data is fresh
        client.application.fetch();
        client.application.commands.fetch();
    }
    fetchStuff();
    setInterval(fetchStuff, 600000);
    (0, app_1.createApp)(client, config_1.CONFIG);
});
client.login(config_1.CONFIG.botToken);
