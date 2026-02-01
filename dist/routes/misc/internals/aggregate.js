"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/aggregate",
        method: "post",
        category: "utility",
        summary: "Aggregate multiple API calls",
        description: "Executes multiple internal API calls in parallel and returns their results in a single response.",
        tags: ["utility", "internal"],
        body: {
            calls: {
                type: "array",
                description: "List of requests",
                required: true,
                example: [
                    { path: "/bot", method: "get" },
                    { path: "/guilds", method: "get" },
                ],
            },
        },
        exampleData: [
            {
                method: "post",
                url: "/api/aggregate",
                body: {
                    calls: [
                        { path: "/bot", method: "get" },
                        { path: "/guilds", method: "get" },
                    ],
                },
                response: {
                    results: [
                        { path: "/bot", method: "get", ok: true, status: 200 },
                        { path: "/guilds", method: "get", ok: true, status: 200 },
                    ],
                },
            },
        ],
    },
    async callback(ctx) {
        const body = ctx.req.body;
        if (!Array.isArray(body?.calls)) {
            return ctx.res.status(400).json({
                error: "Invalid body. Expected { calls: [...] }",
            });
        }
        // Optional: limit batch size
        if (body.calls.length > 10) {
            return ctx.res.status(400).json({
                error: "Maximum 10 calls allowed per aggregate request.",
            });
        }
        const baseUrl = `${ctx.req.protocol}://${ctx.req.get("host")}`;
        const results = await Promise.all(body.calls.map(async (call) => {
            let start = performance.now();
            const method = (call.method ?? "get").toUpperCase();
            // 🚫 Prevent recursion
            if (call.path.startsWith("/aggregate")) {
                return {
                    time: performance.now() - start,
                    path: call.path,
                    method,
                    ok: false,
                    status: 400,
                    error: "Recursive aggregate calls are not allowed",
                };
            }
            const url = new URL(`/api${call.path}`, baseUrl);
            if (call.query) {
                for (const [k, v] of Object.entries(call.query)) {
                    url.searchParams.set(k, String(v));
                }
            }
            try {
                const res = await fetch(url.toString(), {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        password: ctx.req.headers.password ?? "",
                    },
                    body: method !== "GET" && call.body !== undefined
                        ? JSON.stringify(call.body)
                        : undefined,
                });
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                }
                catch {
                    data = text;
                }
                return {
                    time: performance.now() - start,
                    path: call.path,
                    method,
                    ok: res.ok,
                    status: res.status,
                    data,
                };
            }
            catch (err) {
                return {
                    time: performance.now() - start,
                    path: call.path,
                    method,
                    ok: false,
                    status: 500,
                    error: err?.message ?? "Fetch failed",
                };
            }
        }));
        return ctx.res.json({ results });
    },
});
