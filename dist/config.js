"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function requireEnv(name) {
    const value = process.env[name];
    if (!value || value.trim() === "") {
        console.error(chalk_1.default.red(`❌ Missing required environment variable: ${name}`));
        process.exit(1);
    }
    return value;
}
function requireNumber(name) {
    const raw = requireEnv(name);
    const num = Number(raw);
    if (isNaN(num)) {
        console.error(chalk_1.default.red(`❌ Environment variable ${name} must be a number`));
        process.exit(1);
    }
    return num;
}
exports.CONFIG = {
    port: requireNumber("Port"),
    botToken: requireEnv("BotToken"),
    password: requireEnv("Password"),
};
console.log(chalk_1.default.blue("✔ Environment validated"));
