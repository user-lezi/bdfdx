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
          user: {
            id: "123456789012345678",
            username: "MyBot",
            displayName: "MyBot",
            tag: "MyBot#0000",
          },
          application: {
            id: "123456789012345678",
            name: "My Bot",
            public: true,
          },
          stats: {
            guilds: 42,
            users: 12345,
            uptime: 123456789,
            ping: 42,
          },
          runtime: {
            nodeVersion: "v20.x",
            platform: "linux",
            arch: "x64",
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
