"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/db/get/:namespace/:key",
        method: "post",
        category: "database",
        summary: "Get a value from database",
        description: "Get the value from the database with the provided namespace and key.",
        tags: ["db"],
        params: {
            namespace: {
                type: "string",
                description: "The namespace",
                required: true,
                example: "users",
            },
            key: {
                type: "string",
                description: "the key",
                required: true,
                example: "123456123456123456",
            },
        },
        exampleData: [
            {
                method: "post",
                url: "/api/db/get/users/123123123123",
                response: {
                    namespace: "users",
                    key: "123123123123",
                    value: { name: "lezi" },
                },
            },
        ],
    },
    async callback(ctx) {
        const { namespace, key } = ctx.req.params ?? {};
        if (!namespace || !key) {
            return ctx.res.status(400).json({ error: "namespace and key required" });
        }
        const value = await ctx.db.get(namespace, key);
        ctx.res.json({ value, namespace, key });
    },
});
