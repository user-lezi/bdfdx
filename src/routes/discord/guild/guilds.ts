import { createAPIRoute } from "../../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/guilds",
    method: "get",

    summary: "List bot guilds",
    description: "Returns a list of guilds the bot is currently in.",
    category: "discord",
    tags: ["discord", "bot", "guild"],

    query: {
      sort: {
        type: "enum",
        description: "Sort the returned guild list.",
        required: false,
        enum: {
          id: "Sort by guild ID",
          name: "Sort alphabetically by guild name",
          membercount: "Sort by member count (descending)",
          joined: "Sort by join timestamp",
        },
        example: "membercount",
      },
    },

    exampleData: [
      {
        method: "get",
        url: "/api/guilds?sort=membercount",
        response: [
          {
            id: "123456789012345678",
            name: "My Server",
            owner: "987654321098765432",
            icon: "https://cdn.discordapp.com/icons/…",
          },
          {
            id: "234567890123456789",
            name: "Another Server",
            owner: "876543210987654321",
            icon: null,
          },
        ],
      },
    ],
  },

  async callback(ctx) {
    const sort = ctx.req.query.sort as string | undefined;

    // Cached guilds
    let guilds = Array.from(ctx.client.guilds.cache.values());

    // Sorting
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
