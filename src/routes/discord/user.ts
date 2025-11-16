import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  path: "/user/:id",
  methods: ["get"],
  description:
    "Fetches a user's public Discord profile and optionally returns more detailed information.",

  query: {
    fetch: "Force refetch from API instead of cache (true/false)",
    mutualGuilds:
      "Include list of guild IDs the bot shares with the user (true/false)",
    raw: "Include raw Discord.js user object (true/false)",
  },

  body: {},

  async callback(ctx) {
    const id = ctx.req.params.id;

    const q = ctx.req.query;
    const fetchFresh = q.fetch === "true";
    const includeMutual = q.mutualGuilds === "true";
    const includeRaw = q.raw === "true";

    // Fetch user
    const user = await ctx.client.users.fetch(id, { cache: !fetchFresh });

    // Base user object
    let userJSON: any = {
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

    // Optional: mutual guilds
    if (includeMutual) {
      userJSON.mutualGuilds = ctx.client.guilds.cache
        .filter((g) => g.members.cache.has(id))
        .map((g) => g.id);
    }

    // Optional: raw Discord.js fields
    if (includeRaw) {
      userJSON.raw = user;
    }

    ctx.res.json(userJSON);
  },
});
