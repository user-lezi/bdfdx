import { createAPIRoute } from "../../../apiRoute";

export default createAPIRoute({
  path: "/guilds",
  methods: ["get"],
  description: "Returns a list of guilds the bot is in.",

  query: {
    sort: "`id`, `joined`, `membercount`, or `name`. Default: none.",
  },

  async callback(ctx) {
    const sort = ctx.req.query.sort as string | undefined;

    // Fetch all guilds (cached list)
    let guilds = Array.from(ctx.client.guilds.cache.values());

    // Sorting logic
    if (sort === "id") {
      guilds.sort((a, b) => Number(BigInt(a.id) - BigInt(b.id)));
    }

    if (sort === "name") {
      guilds.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    if (sort === "membercount") {
      guilds.sort((a, b) => b.memberCount - a.memberCount);
    }

    if (sort === "joined") {
      guilds.sort(
        (a, b) => (a.joinedTimestamp ?? 0) - (b.joinedTimestamp ?? 0),
      );
    }

    const response = guilds.map((g) => ({
      id: g.id,
      name: g.name,
      owner: g.ownerId,
      icon: g.iconURL({ size: 1024 }),
    }));

    ctx.res.json(response);
  },
});
