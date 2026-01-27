"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPIRoute = createAPIRoute;
const chalk_1 = __importDefault(require("chalk"));
function createAPIRoute(data) {
    if (!data.meta.path.startsWith("/"))
        data.meta.path = "/" + data.meta.path;
    const runtimePath = "/api" + data.meta.path;
    if (!data.meta.method.length) {
        throw new Error(`Route ${data.meta.path} must define a method`);
    }
    return {
        meta: data.meta, // 🔥 exposed for docgen
        execute(app, client) {
            const method = data.meta.method;
            if (typeof app[method] !== "function") {
                console.log(chalk_1.default.red(`⚠ Invalid method "${method}" in route ${data.meta.path}`));
                return;
            }
            app[method](runtimePath, (req, res, next) => data.callback({ client, req, res, next }));
            console.log(chalk_1.default.green(`✔ [${method.toUpperCase()}] ${runtimePath}`));
        },
    };
}
