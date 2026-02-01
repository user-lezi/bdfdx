import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/db/delete/:namespace/:key",
    method: "delete",
    category: "database",
    summary: "Delete a key",
    description: "Delete a key from the database.",
    tags: ["db"],

    params: {
      namespace: { type: "string", required: true },
      key: { type: "string", required: true },
    },

    exampleData: [
      {
        method: "delete",
        url: "/api/db/delete/users/123456",
        response: { deleted: true },
      },
    ],
  },

  async callback(ctx) {
    const { namespace, key } = ctx.req.params;
    const deleted = await ctx.db.delete(namespace, key);
    ctx.res.json({ deleted });
  },
});
