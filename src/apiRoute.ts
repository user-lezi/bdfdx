import chalk from "chalk";
import { Client } from "discord.js";
import { NextFunction, Request, Response, Express } from "express";

export type Method = "get" | "post" | "put" | "delete";

export function createAPIRoute(data: {
  path: string;
  methods: Method[];
  description: string;
  query?: Record<string, string>;
  body?: Record<string, string>;
  callback: (ctx: {
    client: Client<true>;
    res: Response;
    req: Request;
    next: NextFunction;
  }) => unknown;
}) {
  // Ensure path starts with '/'
  if (!data.path.startsWith("/")) data.path = "/" + data.path;

  // Prefix with /api (docgen expects the raw path but runtime needs prefixed)
  const runtimePath = "/api" + data.path;

  // Validate methods
  if (!Array.isArray(data.methods) || data.methods.length === 0) {
    throw new Error(
      `Route ${data.path} must contain at least one HTTP method.`,
    );
  }

  return {
    // 🔥 important → expose EXACT raw metadata for docgen
    data,

    execute(app: Express, client: Client<true>) {
      for (const method of data.methods) {
        if (typeof (app as any)[method] !== "function") {
          console.log(
            chalk.red(
              `⚠ Invalid method "${method}" in route ${data.path} (skipped)`,
            ),
          );
          continue;
        }

        (app as any)[method](
          runtimePath,
          (req: Request, res: Response, next: NextFunction) =>
            data.callback({ client, req, res, next }),
        );

        console.log(
          chalk.green(
            `\t✔ Route Loaded → ${chalk.yellow(`[${method.toUpperCase()}]`)} ${runtimePath}`,
          ),
        );
      }
    },
  };
}
