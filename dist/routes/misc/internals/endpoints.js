"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/endpoints",
        method: "get",
        summary: "List all API endpoints",
        description: "Returns a machine-readable list of all available API endpoints along with their metadata. Primarily used for documentation generation, API explorers, and internal tooling.",
        category: "utility",
        tags: ["utility", "internal"],
        exampleData: [
            {
                url: "/api/endpoints",
                method: "get",
                response: {
                    endpoints: [
                        {
                            path: "/guild/:id",
                            methods: ["get", "delete"],
                            summary: "Fetch guild info or leave a guild",
                            tags: ["guild", "action"],
                        },
                        {
                            path: "/user/:id",
                            methods: ["get"],
                            summary: "Fetch a user's public Discord profile",
                            tags: ["user"],
                        },
                    ],
                },
            },
        ],
    },
    callback(ctx) {
        return ctx.res.json(JSON.parse((0, fs_1.readFileSync)("docs/endpoints.json", "utf-8")));
    },
});
