import { createAPIRoute } from "../../../apiRoute";
import {
  ChannelType,
  type MessageCreateOptions,
  type JSONEncodable,
  MessagePayload,
} from "discord.js";

export default createAPIRoute({
  path: "/channel/:id/messages",
  methods: ["post"],
  description:
    "Send a message to a channel. Supports both v1 and v2 component formats.",

  // For docgen
  body: {
    content: "Message text content",
    embeds: "Array of embed objects",
    components: "Array of components",
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
