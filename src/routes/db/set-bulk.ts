import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/db/set-bulk/:namespace",
    method: "post",
    category: "database",
    summary: "Set multiple values",
    description: "Set multiple key-value pairs in a namespace.",
    tags: ["db"],

    params: {
      namespace: { type: "string", required: true },
    },

    body: {
      entries: {
        type: "array",
        required: true,
        example: [
          ["123", { xp: 10 }],
          ["456", { xp: 20 }],
        ],
      },
    },

    exampleData: [
      {
        method: "post",
        url: "/api/db/set-bulk/users",
        body: {
          entries: [["123", { xp: 10 }]],
        },
        response: { success: true },
      },
    ],
  },

  async callback(ctx) {
    const { namespace } = ctx.req.params;
    const { entries } = ctx.req.body;

    await ctx.db.setBulk(namespace, entries);
    ctx.res.json({ success: true });
  },
});
