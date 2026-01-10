"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    path: "/guild/:id",
    methods: ["get", "delete"],
    description: "Fetches a guild's public information or makes the bot leave the guild.",
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
        // =====================
        // DELETE → Leave guild
        // =====================
        if (ctx.req.method === "DELETE") {
            try {
                await guild.leave();
                return ctx.res.json({
                    success: true,
                    message: "Bot left the guild",
                    id: guild.id,
                });
            }
            catch (err) {
                return ctx.res.status(500).json({
                    error: "Failed to leave guild",
                    code: 500,
                });
            }
        }
        // =====================
        // GET → Guild info
        // =====================
        // Owner
        const owner = await guild.fetchOwner({ cache: true });
        const guildJSON = {
            id: guild.id,
            name: guild.name,
            description: guild.description ?? null,
            owner: {
                id: owner.id,
                username: owner.user.username,
                name: owner.user.displayName,
                icon: owner.user.displayAvatarURL({ size: 1024 }),
            },
            dates: {
                created: guild.createdTimestamp,
                joined: guild.joinedTimestamp,
            },
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
        if (includeRaw) {
            guildJSON.raw = guild;
        }
        ctx.res.json(guildJSON);
    },
});
