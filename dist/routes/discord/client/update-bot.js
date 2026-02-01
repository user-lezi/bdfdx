"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/bot/update",
        method: "post",
        summary: "Update bot identity",
        description: "Updates the bot's username, avatar, or banner. Only provided fields will be changed.",
        category: "discord",
        tags: ["discord", "bot", "action", "utility"],
        body: {
            name: {
                type: "string",
                description: "The new name for the bot.",
                example: "NewBotName",
                required: false,
            },
            avatar: {
                type: "string",
                description: "The new avatar URL",
                example: "https://example.com/avatar.png",
                required: false,
            },
            banner: {
                type: "string",
                description: "The new banner URL",
                example: "https://example.com/banner.png",
                required: false,
            },
        },
        exampleData: [
            {
                method: "post",
                url: "/api/bot/update",
                body: {
                    name: "NewBotName",
                    avatar: "https://example.com/avatar.png",
                },
                response: {
                    success: true,
                    updated: ["name", "avatar"],
                },
            },
        ],
    },
    async callback(ctx) {
        const client = ctx.client;
        const user = client.user;
        if (!user) {
            return ctx.res.status(500).json({
                error: "Bot user is not available",
            });
        }
        const body = ctx.req.body;
        if (!body || (!body.name && !body.avatar && !body.banner)) {
            return ctx.res.status(400).json({
                error: "At least one field must be provided: name, avatar, banner",
            });
        }
        const updated = [];
        try {
            if (body.name) {
                await user.setUsername(body.name);
                updated.push("name");
            }
            if (body.avatar) {
                await user.setAvatar(body.avatar);
                updated.push("avatar");
            }
            if (body.banner) {
                await user.setBanner(body.banner);
                updated.push("banner");
            }
            return ctx.res.json({
                success: true,
                updated,
                user: {
                    id: user.id,
                    username: user.username,
                    displayName: user.displayName,
                    avatar: user.displayAvatarURL({ size: 1024 }) ?? null,
                    banner: user.bannerURL({ size: 1024 }) ?? null,
                },
            });
        }
        catch (err) {
            return ctx.res.status(500).json({
                success: false,
                error: err?.message ?? "Failed to update bot",
            });
        }
    },
});
