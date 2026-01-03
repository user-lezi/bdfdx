"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../apiRoute");
const util_1 = __importDefault(require("util"));
exports.default = (0, apiRoute_1.createAPIRoute)({
    path: "/dapi",
    methods: ["post"],
    description: "Owner-only raw Discord API access via client.rest",
    body: {
        method: "HTTP method (GET, POST, PATCH, DELETE)",
        route: "Discord API route (e.g. /users/@me)",
        query: "Optional query object",
        body: "Optional JSON body",
    },
    async callback(ctx) {
        const { method = "GET", route, query, body } = ctx.req.body ?? {};
        if (!route || typeof route !== "string") {
            return ctx.res.status(400).json({
                ok: false,
                error: "Missing or invalid route",
            });
        }
        const httpMethod = String(method).toUpperCase();
        if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(httpMethod)) {
            return ctx.res.status(400).json({
                ok: false,
                error: `Invalid HTTP method: ${method}`,
            });
        }
        let fullRoute = route;
        let queryEntires = Object.entries(query);
        if (queryEntires.length) {
            fullRoute += "?";
            queryEntires.forEach((entry) => (fullRoute += entry.join("=")));
        }
        try {
            const rest = ctx.client.rest;
            const res = await rest.request({
                method: httpMethod,
                fullRoute: fullRoute,
                body,
            });
            ctx.res.json({
                ok: true,
                method: httpMethod,
                route,
                fullRoute,
                response: format(res),
                type: typeof res,
            });
        }
        catch (err) {
            ctx.res.json({
                ok: false,
                route,
                fullRoute,
                error: err?.rawError ?? err?.message ?? String(err),
                stack: err?.stack,
                status: err?.status,
            });
        }
    },
});
function format(value) {
    return util_1.default.inspect(value, {
        depth: 6,
        colors: false,
        maxArrayLength: 100,
        breakLength: 100,
    });
}
