"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    path: "/guild/:id/members",
    methods: ["get"],
    description: "Returns members of a guild.",
    query: {
        fetch: "Force-fetch all members from API instead of cache. Default: false.",
        type: "`all`, `bots`, or `human`. Default: `all`.",
        sort: "`username`, `id`, or `joined`. Default: none.",
    },
    async callback(ctx) {
        const guildId = ctx.req.params.id;
        const fetch = ctx.req.query.fetch === "true";
        const type = ctx.req.query.type || "all";
        const sort = ctx.req.query.sort;
        const guild = await ctx.client.guilds.fetch(guildId).catch(() => null);
        if (!guild)
            return ctx.res.status(404).json({ error: "Guild not found." });
        // Fetch members
        if (fetch) {
            try {
                await guild.members.fetch(); // full fetch
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
        // Sorting by join date
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
