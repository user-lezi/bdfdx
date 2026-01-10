import { inspect } from "util";
import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/eval",
    methods: ["post"],

    summary: "Evaluate JavaScript code",
    description:
      "Executes arbitrary JavaScript code in an async context and returns the result along with captured console output.",

    tags: ["unsafe", "utility", "action"],

    body: {
      code: {
        type: "string",
        required: true,
        description: "The JavaScript code to evaluate",
        example: "console.log('hi'); 2 + 2;",
      },
    },

    exampleData: [
      {
        method: "post",
        url: "/api/eval",
        response: {
          ok: true,
          result: "4",
          logs: ["hi"],
          type: "number",
        },
      },
    ],
  },

  async callback(ctx) {
    const { code } = ctx.req.body ?? {};

    if (typeof code !== "string" || !code.trim()) {
      return ctx.res.status(400).json({
        ok: false,
        error: "No code provided",
      });
    }

    const logs: string[] = [];

    // hijack console
    const originalConsole = { ...console };

    console.log = (...args: any[]) => logs.push(args.map(format).join(" "));
    console.error = (...args: any[]) =>
      logs.push("[ERR] " + args.map(format).join(" "));
    console.warn = (...args: any[]) =>
      logs.push("[WARN] " + args.map(format).join(" "));

    try {
      // async eval wrapper
      const result = await (async () => eval(code))();

      ctx.res.json({
        ok: true,
        result: format(result),
        logs,
        type: typeof result,
      });
    } catch (err: any) {
      ctx.res.json({
        ok: false,
        error: err?.stack ?? String(err),
        logs,
      });
    } finally {
      // restore console
      Object.assign(console, originalConsole);
    }
  },
});

function format(value: any) {
  return inspect(value, {
    depth: 5,
    colors: false,
    maxArrayLength: 50,
    breakLength: 80,
  });
}
