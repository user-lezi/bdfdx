"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
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
        const commands = {};
        commandsCache.forEach((cmd) => {
            let type = discord_js_1.ApplicationCommandType[cmd.type];
            if (!(type in commands))
                commands[type] = [];
            commands[type].push(cmd.toJSON());
        });
        ctx.res.json({ count: commandsCache.size, commands });
    },
});
