"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const apiRoute_1 = require("../../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    meta: {
        path: "/eval",
        method: "post",
        summary: "Evaluate JavaScript code",
        description: "Executes arbitrary JavaScript code in an async context and returns the result along with captured console output.",
        category: "utility",
        tags: ["unsafe", "utility", "internal", "action"],
        body: {
            code: {
                type: "string",
                required: true,
                description: "The JavaScript code to evaluate",
                example: "console.log('hi'); 2 + 2;",
            },
        },
        exampleData: [
            {
                method: "post",
                url: "/api/eval",
                response: {
                    ok: true,
                    result: "4",
                    logs: ["hi"],
                    type: "number",
                },
            },
        ],
    },
    async callback(ctx) {
        const { code } = ctx.req.body ?? {};
        if (typeof code !== "string" || !code.trim()) {
            return ctx.res.status(400).json({
                ok: false,
                error: "No code provided",
            });
        }
        const logs = [];
        // hijack console
        const originalConsole = { ...console };
        console.log = (...args) => logs.push(args.map(format).join(" "));
        console.error = (...args) => logs.push("[ERR] " + args.map(format).join(" "));
        console.warn = (...args) => logs.push("[WARN] " + args.map(format).join(" "));
        try {
            // async eval wrapper
            const result = await (async () => eval(code))();
            ctx.res.json({
                ok: true,
                result: format(result),
                logs,
                type: typeof result,
            });
        }
        catch (err) {
            ctx.res.json({
                ok: false,
                error: err?.stack ?? String(err),
                logs,
            });
        }
        finally {
            // restore console
            Object.assign(console, originalConsole);
        }
    },
});
function format(value) {
    return (0, util_1.inspect)(value, {
        depth: 5,
        colors: false,
        maxArrayLength: 50,
        breakLength: 80,
    });
}
