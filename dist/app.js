"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
async function createApp(client, config) {
    const start = performance.now();
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // 🔒 Protect all /api routes
    app.use("/api", (req, res, next) => {
        const headerPass = req.headers.password;
        const queryPass = req.query.password;
        const valid = headerPass === config.password || queryPass === config.password;
        if (!valid) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }
        next();
    });
    // Load API routes from routes directory
    const routesFiles = (0, utils_1.recursiveReaddir)(__dirname + "/routes");
    for (const file of routesFiles) {
        const mod = require(file);
        const route = mod.default || mod;
        route.execute(app, client);
        console.log(chalk_1.default.gray("[") +
            chalk_1.default.magenta("API") +
            chalk_1.default.gray("] ") +
            chalk_1.default.yellow("Loaded route file: ") +
            chalk_1.default.cyan(file.replace(__dirname, "")));
        route.data.methods.forEach((method) => console.log("\t" +
            chalk_1.default.gray("[") +
            chalk_1.default.green(method.toUpperCase()) +
            chalk_1.default.gray("] ") +
            chalk_1.default.cyan(route.data.path)));
    }
    app.listen(config.port, () => {
        const bootTime = performance.now() - start;
        console.log(chalk_1.default.blueBright("✔ API Server Started"));
        console.log(chalk_1.default.gray(" ├─") +
            chalk_1.default.white(" Port:          ") +
            chalk_1.default.cyan(config.port.toString()));
        console.log(chalk_1.default.gray(" └─") +
            chalk_1.default.white(" Boot Time:     ") +
            chalk_1.default.magenta(`${bootTime}ms\n`));
    });
    return app;
}
