import { Client } from "discord.js";
import { NextFunction, Request, Response, Express } from "express";

export type Method = "get" | "post";

export function createAPIRoute(data: {
  path: string;
  methods: Method[];
  callback: (ctx: {
    client: Client<true>;
    res: Response;
    req: Request;
    next: NextFunction;
  }) => unknown;
}) {
  data.path = "/api" + data.path;

  return {
    execute: function (app: Express, client: Client<true>) {
      data.methods.forEach((method) => {
        app[method](data.path, (req, res, next) =>
          data.callback({ client, req, res, next }),
        );
      });
    },
    data,
  };
}
