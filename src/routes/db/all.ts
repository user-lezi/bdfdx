import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/db/all/:namespace",
    method: "get",
    category: "database",
    summary: "Get all values",
    description: "Returns all key-value pairs in a namespace.",
    tags: ["db"],

    params: {
      namespace: { type: "string", required: true },
    },

    exampleData: [
      {
        method: "get",
        url: "/api/db/all/users",
        response: {
          data: [
            { key: "123", value: { name: "lezi" } },
            { key: "456", value: { name: "alex" } },
          ],
        },
      },
    ],
  },

  async callback(ctx) {
    const { namespace } = ctx.req.params;
    const all = await ctx.db.all(namespace);
    const data: any[] = [];
    Object.entries(all).forEach(([key, value]) => data.push({ key, value }));
    ctx.res.json({ namespace, data });
  },
});
