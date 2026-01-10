"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../../apiRoute");
const discord_js_1 = require("discord.js");
const utils_1 = require("../../../utils");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/channels/:channelId/messages",
        methods: ["post"],
        summary: "Fetch messages from a channel",
        description: "Fetches messages from a text channel. Supports pagination, user filtering, and full-history fetch when limit is omitted.",
        category: "discord",
        tags: ["message", "discord"],
        params: {
            channelId: {
                type: "string",
                required: true,
                description: "Channel ID",
            },
        },
        query: {
            limit: {
                type: "number",
                description: "Number of messages to fetch. If omitted, all messages will be fetched.",
                example: 100,
            },
            before: {
                type: "string",
                description: "Fetch messages before this message ID",
            },
            after: {
                type: "string",
                description: "Fetch messages after this message ID",
            },
            from: {
                type: "string",
                description: "Only include messages from this user ID",
            },
        },
        exampleData: [
            {
                method: "post",
                url: "/api/channels/123456789/messages?limit=50",
            },
            {
                method: "post",
                url: "/api/channels/123456789/messages?from=987654321",
            },
        ],
    },
    async callback(ctx) {
        const channelId = ctx.req.params.channelId;
        const { limit, before, after, from } = ctx.req.query;
        const channel = await ctx.client.channels
            .fetch(channelId)
            .catch(() => null);
        if (!channel)
            return ctx.res.status(404).json({ error: "Channel not found" });
        if (channel.type !== discord_js_1.ChannelType.GuildText)
            return ctx.res.status(400).json({
                error: "Only guild text channels are supported",
            });
        const textChannel = channel;
        let messages;
        // No limit → fetch all
        if (!limit) {
            messages = await (0, utils_1.fetchAllMessagesSafe)(textChannel, {
                before: before,
                after: after,
                fromUserId: from,
            });
        }
        else {
            const fetched = await textChannel.messages.fetch({
                limit: Math.min(Number(limit), 100),
                before: before,
                after: after,
            });
            messages = [...fetched.values()].filter((m) => !from || m.author.id === from);
        }
        ctx.res.json(messages.map((m) => ({
            id: m.id,
            content: m.content,
            author: {
                id: m.author.id,
                username: m.author.username,
                bot: m.author.bot,
                avatar: m.author.displayAvatarURL({ size: 1024 }),
            },
            embeds: m.embeds,
            components: m.components,
            flags: m.flags.toArray() ?? [],
            createdTimestamp: m.createdTimestamp,
            editedTimestamp: m.editedTimestamp,
            pinned: m.pinned,
        })));
    },
});
