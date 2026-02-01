import { createAPIRoute } from "../../../apiRoute";
import { ChannelType } from "discord.js";

export default createAPIRoute({
  meta: {
    path: "/channels/:channelId/messages/:messageId",
    method: "delete",
    category: "discord",

    summary: "Delete a message",
    description:
      "Deletes a message from a Discord text channel. The bot must have permission to delete the message.",

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

    exampleData: [
      {
        method: "delete",
        url: "/api/channels/123456789012345678/messages/987654321098765432",
        response: {
          success: true,
          messageId: "987654321098765432",
        },
      },
    ],
  },

  async callback(ctx) {
    const { channelId, messageId } = ctx.req.params;

    // Fetch channel
    const channel = await ctx.client.channels
      .fetch(channelId)
      .catch(() => null);

    if (!channel) {
      return ctx.res.status(404).json({
        error: "Channel not found.",
      });
    }

    if (channel.type !== ChannelType.GuildText) {
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

      await message.delete();

      return ctx.res.json({
        success: true,
        messageId,
        channelId,
      });
    } catch (err) {
      return ctx.res.status(500).json({
        error: "Failed to delete message.",
        details: (err as Error).message,
      });
    }
  },
});
