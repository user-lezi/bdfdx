import { readFileSync } from "fs";
import { createAPIRoute } from "../../apiRoute";

export default createAPIRoute({
  meta: {
    path: "/endpoints",
    methods: ["get"],

    summary: "List all API endpoints",
    description:
      "Returns a machine-readable list of all available API endpoints along with their metadata. Primarily used for documentation generation, API explorers, and internal tooling.",
    category: "utility",
    tags: ["utility"],

    exampleData: [
      {
        url: "/api/endpoints",
        method: "get",
        response: {
          endpoints: [
            {
              path: "/guild/:id",
              methods: ["get", "delete"],
              summary: "Fetch guild info or leave a guild",
              tags: ["guild", "action"],
            },
            {
              path: "/user/:id",
              methods: ["get"],
              summary: "Fetch a user's public Discord profile",
              tags: ["user"],
            },
          ],
        },
      },
    ],
  },

  callback(ctx) {
    return ctx.res.json(
      JSON.parse(readFileSync("docs/endpoints.json", "utf-8")),
    );
  },
});
