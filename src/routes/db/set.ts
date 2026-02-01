import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/db/set/:namespace/:key",
    method: "post",
    category: "database",
    summary: "Set a value in database",
    description:
      "Set or update a value in the database for a namespace and key.",
    tags: ["db"],

    params: {
      namespace: {
        type: "string",
        required: true,
        example: "users",
      },
      key: {
        type: "string",
        required: true,
        example: "123456",
      },
    },

    body: {
      value: {
        type: "any",
        required: true,
        example: { name: "lezi" },
      },
      options: {
        type: "object",
        required: false,
        example: { merge: true, ttl: 60000 },
      },
    },

    exampleData: [
      {
        method: "post",
        url: "/api/db/set/users/123456",
        body: { value: { name: "lezi" } },
        response: { success: true },
      },
    ],
  },

  async callback(ctx) {
    const { namespace, key } = ctx.req.params;
    const { value, options } = ctx.req.body ?? {};

    await ctx.db.set(namespace, key, value, options);
    ctx.res.json({ success: true });
  },
});
