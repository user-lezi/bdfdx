import { createAPIRoute } from "../../../apiRoute";
import {
  ChannelType,
  type MessageCreateOptions,
  MessagePayload,
} from "discord.js";

export default createAPIRoute({
  meta: {
    path: "/channel/:id/messages",
    methods: ["post"],

    summary: "Send a message to a channel",
    description:
      "Send a message to a Discord channel. Supports content, embeds, and components (v1 & v2 format).",

    tags: ["discord", "bot", "action"],

    params: {
      id: {
        type: "string",
        description: "The ID of the channel",
        required: true,
        example: "123456789012345678",
      },
    },

    body: {
      content: {
        type: "string",
        description: "The text content of the message",
        required: false,
        example: "Hello, world!",
      },
      embeds: {
        type: "array",
        description: "Array of embed objects (Discord API format)",
        required: false,
        example: [{ title: "Embed Title", description: "Embed description" }],
      },
      components: {
        type: "array",
        description: "Array of message components (buttons, selects, etc.)",
        required: false,
        example: [
          {
            type: 1,
            components: [
              { type: 2, label: "Click me", style: 1, custom_id: "btn_1" },
            ],
          },
        ],
      },
    },

    exampleData: [
      {
        method: "post",
        url: "/api/channel/123456789012345678/messages",
        body: {
          content: "Hello, world!",
          embeds: [{ title: "Embed Title", description: "Embed description" }],
        },
        response: {
          messagePayload: {
            content: "Hello, world!",
            embeds: [
              { title: "Embed Title", description: "Embed description" },
            ],
          },
          message: {
            id: "987654321098765432",
            content: "Hello, world!",
            author: {
              id: "111222333444555666",
              username: "BotUser",
              bot: true,
            },
            embeds: [
              { title: "Embed Title", description: "Embed description" },
            ],
          },
        },
      },
    ],
  },

  async callback(ctx) {
    const channelId = ctx.req.params.id;
    const body = ctx.req.body;

    if (!body || typeof body !== "object") {
      return ctx.res.status(400).json({
        error: "Invalid or missing JSON body.",
      });
    }

    // Fetch channel
    const channel = await ctx.client.channels
      .fetch(channelId)
      .catch(() => null);
    if (!channel)
      return ctx.res.status(404).json({ error: "Channel not found." });

    if (channel.type !== ChannelType.GuildText)
      return ctx.res.status(400).json({
        error: "This endpoint only supports text channels.",
      });

    let messagePayload: MessageCreateOptions | MessagePayload = body;
    try {
      const msg = await channel.send(messagePayload);
      ctx.res.json({
        messagePayload,
        message: msg,
      });
    } catch (err) {
      ctx.res.status(500).json({
        error: "Failed to send message.",
        details: (err as Error).message,
      });
    }
  },
});
