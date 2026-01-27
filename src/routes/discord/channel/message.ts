import { ChannelType } from "discord.js";
import { createAPIRoute } from "../../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/channels/:channelId/messages/:messageId",
    method: "get",

    summary: "Fetch a channel message",
    description:
      "Fetches a specific message from a text channel by channel ID and message ID.",
    category: "discord",
    tags: ["discord", "message"],

    params: {
      channelId: {
        type: "string",
        required: true,
        description: "ID of the channel containing the message",
      },
      messageId: {
        type: "string",
        required: true,
        description: "ID of the message to fetch",
      },
    },

    query: {
      raw: {
        type: "boolean",
        description: "Include raw Discord.js message object",
        example: false,
      },
    },

    exampleData: [
      {
        url: "/api/channels/123456789012345678/messages/987654321098765432",
        method: "get",
        response: {
          id: "987654321098765432",
          content: "hello world",
          author: {
            id: "111111111111111111",
            username: "Slayzi",
            bot: false,
            avatar: "https://cdn.discordapp.com/avatars/...",
          },
          channelId: "123456789012345678",
          createdTimestamp: 1710000000000,
          editedTimestamp: null,
          pinned: false,
          tts: false,
          mentions: {
            users: [],
            roles: [],
            everyone: false,
          },
        },
      },
    ],
  },

  async callback(ctx) {
    const { channelId, messageId } = ctx.req.params;
    const includeRaw = ctx.req.query.raw === "true";

    const channel = await ctx.client.channels
      .fetch(channelId)
      .catch(() => null);

    if (!channel)
      return ctx.res.status(404).json({ error: "Channel not found" });

    if (channel.type !== ChannelType.GuildText)
      return ctx.res.status(400).json({
        error: "Only guild text channels are supported",
      });

    let message;
    try {
      message = await channel.messages.fetch(messageId);
    } catch {
      return ctx.res.status(404).json({ error: "Message not found" });
    }

    const messageJSON: any = {
      id: message.id,
      content: message.content,
      channelId: message.channelId,

      author: {
        id: message.author.id,
        username: message.author.username,
        bot: message.author.bot,
        avatar: message.author.displayAvatarURL({ size: 1024 }),
      },

      createdTimestamp: message.createdTimestamp,
      editedTimestamp: message.editedTimestamp,

      pinned: message.pinned,
      tts: message.tts,

      mentions: {
        users: message.mentions.users.map((u) => ({
          id: u.id,
          username: u.username,
        })),
        roles: message.mentions.roles.map((r) => ({
          id: r.id,
          name: r.name,
        })),
        everyone: message.mentions.everyone,
      },
    };

    if (includeRaw) {
      messageJSON.raw = message;
    }

    ctx.res.json(messageJSON);
  },
});
