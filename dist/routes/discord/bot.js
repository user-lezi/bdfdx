"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../apiRoute");
const os_1 = __importDefault(require("os"));
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/bot",
        methods: ["get"],
        summary: "Fetch bot information",
        description: "Returns public bot identity, application metadata, runtime statistics, and environment information.",
        tags: ["discord", "bot", "utility"],
        exampleData: [
            {
                method: "get",
                url: "/api/bot",
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
        const user = client.user;
        ctx.res.json({
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                discriminator: user.discriminator,
                tag: user.tag,
                avatar: user.displayAvatarURL({ size: 1024 }) ?? null,
                banner: user.bannerURL({ size: 1024 }) ?? null,
                createdTimestamp: user.createdTimestamp,
            },
            application: {
                id: client.application.id,
                name: client.application.name,
                description: client.application.description ?? null,
                public: client.application.botPublic,
                termsOfServiceUrl: client.application.termsOfServiceURL ?? null,
                privacyPolicyUrl: client.application.privacyPolicyURL ?? null,
                flags: client.application.flags?.toArray() ?? [],
            },
            stats: {
                guilds: client.guilds.cache.size,
                users: client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0),
                uptime: client.uptime,
                readyTimestamp: client.readyTimestamp,
                ping: client.ws.ping,
            },
            runtime: {
                nodeVersion: process.version,
                discordJSVersion: require("discord.js").version,
                memory: {
                    rss: process.memoryUsage().rss,
                    heapUsed: process.memoryUsage().heapUsed,
                },
                platform: os_1.default.platform(),
                arch: os_1.default.arch(),
            },
        });
    },
});
