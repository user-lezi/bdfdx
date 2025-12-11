"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPIRoute = createAPIRoute;
const chalk_1 = __importDefault(require("chalk"));
function createAPIRoute(data) {
    // Ensure path starts with '/'
    if (!data.path.startsWith("/"))
        data.path = "/" + data.path;
    // Prefix with /api (docgen expects the raw path but runtime needs prefixed)
    const runtimePath = "/api" + data.path;
    // Validate methods
    if (!Array.isArray(data.methods) || data.methods.length === 0) {
        throw new Error(`Route ${data.path} must contain at least one HTTP method.`);
    }
    return {
        // 🔥 important → expose EXACT raw metadata for docgen
        data,
        execute(app, client) {
            for (const method of data.methods) {
                if (typeof app[method] !== "function") {
                    console.log(chalk_1.default.red(`⚠ Invalid method "${method}" in route ${data.path} (skipped)`));
                    continue;
                }
                app[method](runtimePath, (req, res, next) => data.callback({ client, req, res, next }));
                console.log(chalk_1.default.green(`\t✔ Route Loaded → ${chalk_1.default.yellow(`[${method.toUpperCase()}]`)} ${runtimePath}`));
            }
        },
    };
}
