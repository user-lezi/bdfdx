import { ApplicationCommandType } from "discord.js";
import { createAPIRoute } from "../../../apiRoute";
import os from "os";

export default createAPIRoute({
  meta: {
    path: "/commands",
    method: "get",

    summary: "List registered application commands",
    description: "Returns bot's application commands and it's information.",
    category: "discord",
    tags: ["discord", "bot", "utility"],

    exampleData: [
      {
        method: "get",
        url: "/api/commands",
        response: {
          count: 2,
          commands: {
            ChatInput: [
              {
                type: 0,
                id: "123456789012345678",
                name: "help",
                description: "List all the commands.",
              },
              {
                type: 0,
                id: "123123123123123123",
                name: "balance",
                description: "Shows your balance.",
              },
            ],
          },
        },
      },
    ],
  },

  async callback(ctx) {
    const client = ctx.client;
    const commandsCache = client.application.commands.cache;
    const commands: any = {};
    commandsCache.forEach((cmd) => {
      let type = ApplicationCommandType[cmd.type];
      if (!(type in commands)) commands[type] = [];

      commands[type].push(cmd.toJSON());
    });
    ctx.res.json({ count: commandsCache.size, commands });
  },
});
