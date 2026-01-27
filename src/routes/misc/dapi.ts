import { RequestMethod } from "discord.js";
import { createAPIRoute } from "../../apiRoute";
import util from "util";

export default createAPIRoute({
  meta: {
    path: "/dapi",
    method: "post",

    summary: "Raw Discord REST API access",
    description:
      "Allows the bot owner to directly execute raw Discord REST API requests using client.rest. Extremely powerful and unsafe.",
    category: "discord",
    tags: ["unsafe", "discord", "bot", "action"],

    body: {
      method: {
        type: "enum",
        required: false,
        description: "HTTP method to use for the Discord API request",
        example: "GET",
        enum: {
          GET: "GET",
          POST: "POST",
          PUT: "PUT",
          PATCH: "PATCH",
          DELETE: "DELETATTE",
        },
      },
      route: {
        type: "string",
        required: true,
        description: "Discord API route (without base URL)",
        example: "/users/@me",
      },
      query: {
        type: "object",
        required: false,
        description: "Optional query parameters object",
        example: { limit: 10 },
      },
      body: {
        type: "object",
        required: false,
        description: "Optional JSON body for the request",
        example: { name: "New Channel Name" },
      },
    },

    exampleData: [
      {
        method: "post",
        url: "/api/dapi",
        body: {
          method: "GET",
          route: "/users/@me",
        },
        response: {
          ok: true,
          method: "GET",
          route: "/users/@me",
          fullRoute: "/users/@me",
          response: {
            id: "1234567890",
            username: "Bot",
          },
          type: "object",
        },
      },
    ],
  },

  async callback(ctx) {
    const { method = "GET", route, query, body } = ctx.req.body ?? {};

    if (!route || typeof route !== "string") {
      return ctx.res.status(400).json({
        ok: false,
        error: "Missing or invalid route",
      });
    }

    const httpMethod = String(method).toUpperCase() as RequestMethod;

    if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(httpMethod)) {
      return ctx.res.status(400).json({
        ok: false,
        error: `Invalid HTTP method: ${method}`,
      });
    }

    let fullRoute = route;
    const queryEntries = Object.entries(query ?? {});
    if (queryEntries.length) {
      fullRoute += "?";
      queryEntries.forEach(([k, v], i) => {
        fullRoute += `${k}=${encodeURIComponent(String(v))}${
          i < queryEntries.length - 1 ? "&" : ""
        }`;
      });
    }

    try {
      const rest = ctx.client.rest;

      const res = await rest.request({
        method: httpMethod,
        fullRoute: fullRoute as `/`,
        body,
      });

      ctx.res.json({
        ok: true,
        method: httpMethod,
        route,
        fullRoute,
        response: format(res),
        type: typeof res,
      });
    } catch (err: any) {
      ctx.res.json({
        ok: false,
        route,
        fullRoute,
        error: err?.rawError ?? err?.message ?? String(err),
        stack: err?.stack,
        status: err?.status,
      });
    }
  },
});

function format(value: any) {
  return util.inspect(value, {
    depth: 6,
    colors: false,
    maxArrayLength: 100,
    breakLength: 100,
  });
}
