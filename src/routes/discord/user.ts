import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/user/:userId",
    method: "get",

    summary: "Fetch Discord user profile",
    description:
      "Fetches a user's public Discord profile and can optionally include mutual guilds or the raw Discord.js user object.",
    category: "discord",
    tags: ["discord", "user"],

    params: {
      userId: {
        type: "string",
        required: true,
        description: "Discord user ID",
        example: "123456789012345678",
      },
    },

    query: {
      fetch: {
        type: "boolean",
        required: false,
        description: "Force refetch from Discord API instead of cache",
        example: true,
      },
      mutualGuilds: {
        type: "boolean",
        required: false,
        description:
          "Include guilds the bot and user share (requires member cache)",
        example: true,
      },
      raw: {
        type: "boolean",
        required: false,
        description: "Include raw Discord.js User object",
        example: false,
      },
    },

    exampleData: [
      {
        method: "get",
        url: "/api/user/123456789012345678?mutualGuilds=true",
        response: {
          id: "123456789012345678",
          username: "SomeUser",
          displayName: "SomeUser",
          tag: "SomeUser#0001",
          bot: false,
          globalName: "Some User",
          flags: ["EarlySupporter"],
          avatar: "https://cdn.discordapp.com/...",
          banner: null,
          createdTimestamp: 1600000000000,
          accentColor: 16711680,
          mutualGuilds: [
            {
              id: "987654321098765432",
              name: "Example Server",
              nickname: "Nick",
            },
          ],
        },
      },
    ],
  },

  async callback(ctx) {
    const id = ctx.req.params.userId;

    const q = ctx.req.query;
    const fetchFresh = q.fetch === "true";
    const includeMutual = q.mutualGuilds === "true";
    const includeRaw = q.raw === "true";

    // Fetch user
    const user = await ctx.client.users.fetch(id, { cache: !fetchFresh });

    // Base user JSON
    const userJSON: any = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      tag: user.tag,
      bot: user.bot,
      globalName: user.globalName,
      flags: user.flags?.toArray() ?? null,

      avatar: user.displayAvatarURL({ size: 1024 }),
      banner: user.bannerURL({ size: 1024 }),
      decoration: user.avatarDecorationURL({ size: 1024 }),

      createdTimestamp: user.createdTimestamp,
      accentColor: user.accentColor,
    };

    // Mutual guilds
    if (includeMutual) {
      userJSON.mutualGuilds = ctx.client.guilds.cache
        .filter((g) => g.members.cache.has(id))
        .map((g) => ({
          id: g.id,
          name: g.name,
          nickname: g.members.cache.get(id)?.nickname ?? null,
          icon: g.iconURL({ size: 1024 }),
        }));
    }

    // Raw Discord.js object
    if (includeRaw) {
      userJSON.raw = user;
    }

    ctx.res.json(userJSON);
  },
});
