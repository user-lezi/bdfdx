"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/guild/:guildId/members",
        methods: ["get"],
        summary: "Fetch guild members",
        description: "Returns members of a guild with optional filtering, sorting, and force-fetching from the Discord API.",
        category: "discord",
        tags: ["discord", "guild", "member"],
        params: {
            guildId: {
                type: "string",
                description: "The ID of the guild whose members are being fetched.",
                required: true,
                example: "123456789012345678",
            },
        },
        query: {
            fetch: {
                type: "boolean",
                description: "Force-fetch all members from Discord API instead of using cache.",
                required: false,
                example: false,
            },
            type: {
                type: "enum",
                description: "Filter members by type.",
                enum: {
                    all: "All members",
                    bots: "Only bot accounts",
                    human: "Only human users",
                },
                required: false,
                example: "all",
            },
            sort: {
                type: "enum",
                description: "Sort returned members.",
                enum: {
                    username: "Sort by username (A–Z)",
                    id: "Sort by user ID",
                    joined: "Sort by join timestamp",
                },
                required: false,
                example: "username",
            },
        },
        exampleData: [
            {
                method: "get",
                url: "/api/guild/123456789012345678/members?type=human&sort=username",
                response: [
                    {
                        id: "111111111111111111",
                        username: "Alice",
                        bot: false,
                        avatar: "https://cdn.discordapp.com/avatars/…",
                    },
                    {
                        id: "222222222222222222",
                        username: "Bob",
                        bot: false,
                        avatar: "https://cdn.discordapp.com/avatars/…",
                    },
                ],
            },
        ],
    },
    async callback(ctx) {
        const guildId = ctx.req.params.guildId;
        const fetch = ctx.req.query.fetch === "true";
        const type = ctx.req.query.type || "all";
        const sort = ctx.req.query.sort;
        const guild = await ctx.client.guilds.fetch(guildId).catch(() => null);
        if (!guild)
            return ctx.res.status(404).json({ error: "Guild not found." });
        // Force fetch members
        if (fetch) {
            try {
                await guild.members.fetch();
            }
            catch {
                return ctx.res.status(500).json({
                    error: "Failed to fetch members from API.",
                });
            }
        }
        let members = Array.from(guild.members.cache.values());
        // Filtering
        if (type === "bots")
            members = members.filter((m) => m.user.bot);
        if (type === "human")
            members = members.filter((m) => !m.user.bot);
        // Sorting
        if (sort === "username")
            members.sort((a, b) => (a.user.username || "").localeCompare(b.user.username || ""));
        if (sort === "id")
            members.sort((a, b) => Number(BigInt(a.id) - BigInt(b.id)));
        if (sort === "joined")
            members.sort((a, b) => (a.joinedTimestamp ?? 0) - (b.joinedTimestamp ?? 0));
        const response = members.map((m) => ({
            id: m.id,
            username: m.user.username,
            bot: m.user.bot,
            avatar: m.user.displayAvatarURL({ size: 1024 }),
        }));
        return ctx.res.json(response);
    },
});
