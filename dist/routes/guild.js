"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    path: "/guild/:id",
    methods: ["get"],
    description: "Fetches a guild's public information and optionally returns more detailed metadata.",
    query: {
        fetch: "Force refetch from API instead of cache (true/false)",
        raw: "Include raw Discord.js guild object (true/false)",
    },
    body: {},
    async callback(ctx) {
        const id = ctx.req.params.id;
        const q = ctx.req.query;
        const fetchFresh = q.fetch === "true";
        const includeRaw = q.raw === "true";
        // Fetch guild
        let guild;
        try {
            guild = ctx.client.guilds.cache.get(id);
            if (fetchFresh)
                guild = await guild?.fetch();
            if (!guild)
                throw Error();
        }
        catch {
            return ctx.res.status(404).json({
                error: "Guild not found",
                code: 404,
            });
        }
        // Base guild JSON
        const guildJSON = {
            id: guild.id,
            name: guild.name,
            description: guild.description ?? null,
            ownerId: guild.ownerId,
            createdTimestamp: guild.createdTimestamp,
            nsfwLevel: guild.nsfwLevel,
            features: guild.features,
            nameAcronym: guild.nameAcronym,
            icon: guild.iconURL({ size: 1024 }),
            banner: guild.bannerURL({ size: 2048 }),
            locale: guild.preferredLocale,
            vanityURL: guild.vanityURLCode ?? null,
            count: {
                members: guild.memberCount,
                channels: guild.channels.cache.size,
                roles: guild.roles.cache.size,
                emojis: guild.emojis.cache.size,
            },
        };
        // Optional: raw (entire guild object)
        if (includeRaw) {
            guildJSON.raw = guild;
        }
        ctx.res.json(guildJSON);
    },
});
