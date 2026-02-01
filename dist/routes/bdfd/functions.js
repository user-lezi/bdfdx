"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../apiRoute");
const bdfdMetadata_1 = require("../../bdfdMetadata");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/bdfd/functions",
        method: "get",
        summary: "List all BDFD functions.",
        description: "Returns a list of all available BDFD functions with or without details.",
        category: "bdfd",
        tags: ["bdfd", "utility"],
        query: {
            detailed: {
                type: "boolean",
                required: false,
                description: "Show detailed information about the function",
                example: true,
            },
        },
        exampleData: [
            {
                url: "/api/bdfd/functions",
                method: "get",
                response: ["$addButton[]", "$ai", "$botID"],
            },
            {
                url: "/api/bdfd/functions?detailed=true",
                method: "get",
                response: [
                    {
                        tag: "$addButton[]",
                        cleanTag: "$addButton[]",
                        position: 0,
                        description: "Adds a button component",
                        arguments: [],
                        premium: false,
                    },
                ],
            },
        ],
    },
    callback(ctx) {
        const q = ctx.req.query;
        const detailed = q.detailed === "true";
        return ctx.res.json(bdfdMetadata_1.BDFDMetadata.getFunctions(detailed));
    },
});
