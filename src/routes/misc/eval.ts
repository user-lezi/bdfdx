import { inspect } from "util";
import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  path: "/eval",
  methods: ["post"],
  description: "Evaluates the provided Javascript code.",

  query: {},

  body: {
    code: "The javascript code to eval. Eg: `console.log('hi');`",
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
