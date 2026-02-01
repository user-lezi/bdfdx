import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/db/incr/:namespace/:key",
    method: "post",
    category: "database",
    summary: "Increment a numeric path",
    description: "Increment a numeric value inside an object path.",
    tags: ["db"],

    params: {
      namespace: { type: "string", required: true },
      key: { type: "string", required: true },
    },

    body: {
      path: {
        type: "string",
        required: true,
        example: "stats.xp",
      },
      by: {
        type: "number",
        required: false,
        example: 1,
      },
    },

    exampleData: [
      {
        method: "post",
        url: "/api/db/incr/users/123",
        body: { path: "stats.xp", by: 5 },
        response: { value: 10 },
      },
    ],
  },

  async callback(ctx) {
    const { namespace, key } = ctx.req.params;
    const { path, by } = ctx.req.body;

    const value = await ctx.db.incr(namespace, key, path, by);
    ctx.res.json({ namespace, key, value });
  },
});
