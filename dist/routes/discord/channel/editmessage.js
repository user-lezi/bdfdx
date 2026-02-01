"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../../apiRoute");
const discord_js_1 = require("discord.js");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/channels/:channelId/messages/:messageId/edit",
        method: "post",
        category: "discord",
        summary: "Edit a message",
        description: "Edits an existing message in a Discord text channel. Supports content, embeds, and components.",
        tags: ["discord", "bot", "action"],
        params: {
            channelId: {
                type: "string",
                description: "The ID of the channel",
                required: true,
                example: "123456789012345678",
            },
            messageId: {
                type: "string",
                description: "The ID of the message",
                required: true,
                example: "987654321098765432",
            },
        },
        body: {
            content: {
                type: "string",
                description: "Updated text content of the message",
                required: false,
                example: "Edited message content",
            },
            embeds: {
                type: "array",
                description: "Updated embeds (Discord API format)",
                required: false,
                example: [{ title: "Updated Embed", description: "Updated text" }],
            },
            components: {
                type: "array",
                description: "Updated message components (buttons, selects, etc.)",
                required: false,
            },
        },
        exampleData: [
            {
                method: "post",
                url: "/api/channels/123456789012345678/messages/987654321098765432/edit",
                body: {
                    content: "Updated content",
                },
                response: {
                    success: true,
                    messageId: "987654321098765432",
                    channelId: "123456789012345678",
                },
            },
        ],
    },
    async callback(ctx) {
        const { channelId, messageId } = ctx.req.params;
        const body = ctx.req.body;
        if (!body || typeof body !== "object") {
            return ctx.res.status(400).json({
                error: "Invalid or missing JSON body.",
            });
        }
        if (!body.content && !body.embeds && !body.components) {
            return ctx.res.status(400).json({
                error: "At least one field must be provided to edit the message.",
            });
        }
        // Fetch channel
        const channel = await ctx.client.channels
            .fetch(channelId)
            .catch(() => null);
        if (!channel) {
            return ctx.res.status(404).json({
                error: "Channel not found.",
            });
        }
        if (channel.type !== discord_js_1.ChannelType.GuildText) {
            return ctx.res.status(400).json({
                error: "This endpoint only supports text channels.",
            });
        }
        try {
            const message = await channel.messages.fetch(messageId).catch(() => null);
            if (!message) {
                return ctx.res.status(404).json({
                    error: "Message not found.",
                });
            }
            const editPayload = body;
            const edited = await message.edit(editPayload);
            return ctx.res.json({
                success: true,
                messageId: edited.id,
                channelId,
            });
        }
        catch (err) {
            return ctx.res.status(500).json({
                error: "Failed to edit message.",
                details: err.message,
            });
        }
    },
});
