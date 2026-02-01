import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/db/leaderboard/:namespace",
    method: "get",
    category: "database",
    summary: "Generate leaderboard",
    description: "Generate a leaderboard sorted by a numeric object path.",
    tags: ["db"],

    params: {
      namespace: { type: "string", required: true },
    },

    query: {
      path: {
        type: "string",
        required: true,
        example: "stats.xp",
      },
      limit: {
        type: "number",
        required: false,
        example: 10,
      },
      order: {
        type: "string",
        required: false,
        example: "desc",
      },
    },

    exampleData: [
      {
        method: "get",
        url: "/api/db/leaderboard/users?path=stats.xp&limit=3",
        response: {
          data: [
            { key: "123", value: 100 },
            { key: "456", value: 80 },
          ],
        },
      },
    ],
  },

  async callback(ctx) {
    const { namespace } = ctx.req.params;
    const { path, limit, order } = ctx.req.query;
    if (!path || !order) {
      return ctx.res
        .status(404)
        .json({ error: "no path or order is provided." });
    }
    const data = await ctx.db.leaderboard(namespace, path.toString(), {
      limit: limit ? Number(limit) : undefined,
      order: order == "asc" ? "asc" : "desc",
    });

    ctx.res.json({ namespace, data });
  },
});
