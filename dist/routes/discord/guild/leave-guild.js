"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/guild/:guildId",
        method: "delete",
        summary: "Leave guild",
        description: "Commands the bot to leave the guild.",
        category: "discord",
        tags: ["discord", "bot", "guild", "action"],
        query: {
            fetch: {
                type: "boolean",
                description: "Force refetch from API instead of cache",
                required: false,
                example: false,
            },
        },
        params: {
            guildId: {
                type: "string",
                description: "The ID of the guild",
                required: true,
                example: "123456789012345678",
            },
        },
        exampleData: [
            {
                method: "delete",
                url: "/api/guild/123456789012345678",
                response: {
                    id: "123456789012345678",
                    success: true,
                    message: "Bot left the guild.",
                },
            },
        ],
    },
    async callback(ctx) {
        const id = ctx.req.params.guildId;
        const q = ctx.req.query;
        const fetchFresh = q.fetch === "true";
        // Fetch guild
        let guild;
        try {
            guild = ctx.client.guilds.cache.get(id);
            if (fetchFresh)
                guild = await guild.fetch();
            if (!guild)
                throw Error();
        }
        catch {
            return ctx.res.status(404).json({
                error: "Guild not found",
                code: 404,
            });
        }
        try {
            await guild.leave();
            return ctx.res.json({
                success: true,
                message: "Bot left the guild",
                id: guild.id,
            });
        }
        catch {
            return ctx.res.status(500).json({
                error: "Failed to leave guild",
                code: 500,
            });
        }
    },
});
