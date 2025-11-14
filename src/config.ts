import chalk from "chalk";
import { config } from "dotenv";
config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    console.error(
      chalk.red(`❌ Missing required environment variable: ${name}`),
    );
    process.exit(1);
  }
  return value;
}

function requireNumber(name: string): number {
  const raw = requireEnv(name);
  const num = Number(raw);
  if (isNaN(num)) {
    console.error(
      chalk.red(`❌ Environment variable ${name} must be a number`),
    );
    process.exit(1);
  }
  return num;
}

export const CONFIG = {
  port: requireNumber("Port"),
  botToken: requireEnv("BotToken"),
  password: requireEnv("Password"),
};

console.log(chalk.blue("✔ Environment validated"));
