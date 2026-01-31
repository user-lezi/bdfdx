import { request } from "http";
import { createAPIRoute } from "../../apiRoute";

type FetchRequest = {
  url: string;
  method: string;
  headers?: any;
  body?: any;
};

export default createAPIRoute({
  meta: {
    path: "/fetch",
    method: "post",

    summary: "Batch fetch external resources",
    description:
      "Performs multiple HTTP requests in parallel and returns their responses.",
    category: "utility",
    tags: ["utility"],

    body: {
      request: {
        type: "array",
        description: "List of fetch requests",
        required: true,
        example: [
          {
            url: "https://api.github.com",
            method: "GET",
          },
        ],
      },
    },

    exampleData: [
      {
        url: "/api/fetch",
        method: "post",
        body: {
          request: [
            {
              url: "https://api.github.com",
              method: "GET",
            },
            {
              url: "https://httpbin.org/post",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: { hello: "world" },
            },
          ],
        },
        response: {
          results: [
            {
              ok: true,
              status: 200,
              data: {},
            },
            {
              ok: true,
              status: 200,
              data: {},
            },
          ],
        },
      },
    ],
  },

  async callback(ctx) {
    const body = ctx.req.body as { request?: FetchRequest[] };
    if (!Array.isArray(body?.request)) {
      return ctx.res.status(400).json({
        error: "Invalid body. Expected { request: FetchRequest[] }",
      });
    }

    const results = await Promise.all(
      body.request.map(async (req) => {
        const start = performance.now();
        try {
          const res = await fetch(req.url, {
            method: req.method,
            headers: req.headers,
            body:
              req.body !== undefined
                ? typeof req.body === "string"
                  ? req.body
                  : JSON.stringify(req.body)
                : undefined,
          });

          const contentType = res.headers.get("content-type") || "";
          const data = contentType.includes("application/json")
            ? await res.json()
            : await res.text();

          return {
            time: performance.now() - start,
            ok: res.ok,
            status: res.status,
            headers: Object.fromEntries(res.headers.entries()),
            data,
          };
        } catch (err: any) {
          return {
            time: performance.now() - start,
            ok: false,
            error: err?.message ?? "Fetch failed",
          };
        }
      }),
    );

    return ctx.res.json({ results });
  },
});
