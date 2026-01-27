import { Guild } from "discord.js";
import { createAPIRoute } from "../../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/guild/:guildId",
    method: "get",

    summary: "Get guild info",
    description: "Fetches a guild's public information",
    category: "discord",
    tags: ["discord", "bot", "guild"],

    params: {
      guildId: {
        type: "string",
        description: "The ID of the guild",
        required: true,
        example: "123456789012345678",
      },
    },

    query: {
      fetch: {
        type: "boolean",
        description: "Force refetch from API instead of cache",
        required: false,
        example: false,
      },
      raw: {
        type: "boolean",
        description: "Include raw Discord.js guild object",
        required: false,
        example: false,
      },
    },

    exampleData: [
      {
        method: "get",
        url: "/api/guild/123456789012345678?fetch=true",
        response: {
          id: "123456789012345678",
          name: "My Server",
          description: "A test server",
          owner: {
            id: "987654321098765432",
            username: "OwnerUser",
            name: "OwnerDisplay",
            icon: "https://cdn.discordapp.com/avatars/…",
          },
          dates: {
            created: 1680000000000,
            joined: 1685000000000,
          },
          nsfwLevel: 0,
          features: ["ANIMATED_ICON", "BANNER"],
          nameAcronym: "MS",
          icon: "https://cdn.discordapp.com/icons/…",
          banner: "https://cdn.discordapp.com/banners/…",
          locale: "en-US",
          vanityURL: null,
          count: {
            members: 150,
            channels: 20,
            roles: 10,
            emojis: 50,
          },
        },
      },
    ],
  },

  async callback(ctx) {
    const id = ctx.req.params.guildId;
    const q = ctx.req.query;

    const fetchFresh = q.fetch === "true";
    const includeRaw = q.raw === "true";

    // Fetch guild
    let guild: Guild;
    try {
      guild = ctx.client.guilds.cache.get(id)!;
      if (fetchFresh) guild = await guild.fetch();
      if (!guild) throw Error();
    } catch {
      return ctx.res.status(404).json({
        error: "Guild not found",
        code: 404,
      });
    }

    const owner = await guild.fetchOwner({ cache: true });

    const guildJSON: any = {
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

    if (includeRaw) guildJSON.raw = guild;

    ctx.res.json(guildJSON);
  },
});
