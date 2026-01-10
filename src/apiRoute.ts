import chalk from "chalk";
import { Client } from "discord.js";
import { NextFunction, Request, Response, Express } from "express";

export type Method = "get" | "post" | "put" | "delete";

export type Tags =
  /** ⚠️ Dangerous or privileged endpoints (e.g. eval, exec, raw access) */
  | "unsafe"

  /** Discord API–related operations */
  | "discord"

  /** Bot-level data and actions (uptime, stats, presence, config) */
  | "bot"

  /** Guild/server-related endpoints */
  | "guild"

  /** Message-related operations */
  | "message"

  /** Message reactions */
  | "reaction"

  /** Guild member / moderation-related endpoints */
  | "member"

  /** User-related endpoints (Discord users, profiles, lookups) */
  | "user"

  /** Generic utility endpoints (health, ping, helpers, misc) */
  | "utility"

  /** Mutative endpoints that perform an action (leave guild, ban, restart) */
  | "action";

export type Field = {
  type: "string" | "number" | "boolean" | "array" | "object" | "enum";
  description?: string;
  required?: boolean;
  example?: unknown;
  enum?: { [key: string]: string };
};

export type RouteMeta<B extends Record<string, Field>> = {
  path: string;
  methods: Method[];
  summary: string;
  description?: string;

  params?: Record<string, Field>;
  query?: Record<string, Field>;
  body?: B;

  tags?: Tags[];

  exampleData?: {
    url: string;
    method: Method;
    body?: Partial<Record<keyof B, unknown>>;
    response?: unknown;
  }[];
};

export function createAPIRoute<B extends Record<string, Field>>(data: {
  meta: RouteMeta<B>;
  callback: (ctx: {
    client: Client<true>;
    res: Response;
    req: Request;
    next: NextFunction;
  }) => unknown;
}) {
  if (!data.meta.path.startsWith("/")) data.meta.path = "/" + data.meta.path;

  const runtimePath = "/api" + data.meta.path;

  if (!data.meta.methods?.length) {
    throw new Error(`Route ${data.meta.path} must define at least one method`);
  }

  return {
    meta: data.meta, // 🔥 exposed for docgen

    execute(app: Express, client: Client<true>) {
      for (const method of data.meta.methods) {
        if (typeof (app as any)[method] !== "function") {
          console.log(
            chalk.red(
              `⚠ Invalid method "${method}" in route ${data.meta.path}`,
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
          chalk.green(`\t✔ [${method.toUpperCase()}] ${runtimePath}`),
        );
      }
    },
  };
}
