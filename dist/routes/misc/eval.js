"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiRoute_1 = require("../../apiRoute");
exports.default = (0, apiRoute_1.createAPIRoute)({
    path: "/eval",
    methods: ["post"],
    description: "Evaluates the provided Javascript code.",
    query: {},
    body: {
        code: "The javascript code to eval. Eg: `console.log('hi');`",
    },
    async callback(ctx) {
        const body = ctx.req.body;
        if (!body || typeof body !== "object") {
            return ctx.res.status(400).json({
                error: "Invalid or missing JSON body.",
            });
        }
        let code = body.code;
        if (!code)
            return ctx.res.status(404).json({ message: "No code provided." });
        let output = {
            isError: false,
            output: null,
            error: null,
        };
        try {
            output.output = await eval(code);
        }
        catch (error) {
            output.error = error;
            output.isError = true;
        }
        ctx.res.json(output);
    },
});
