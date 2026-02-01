"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/db/keys/:namespace",
        method: "get",
        category: "database",
        summary: "List keys in namespace",
        description: "Returns all keys stored under a namespace.",
        tags: ["db"],
        params: {
            namespace: { type: "string", required: true },
        },
        exampleData: [
            {
                method: "get",
                url: "/api/db/keys/users",
                response: { keys: ["123", "456"] },
            },
        ],
    },
    async callback(ctx) {
        const { namespace } = ctx.req.params;
        const keys = await ctx.db.keys(namespace);
        ctx.res.json({ namespace, keys });
    },
});
