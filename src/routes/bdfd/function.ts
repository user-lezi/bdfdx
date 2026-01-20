import { createAPIRoute } from "../../apiRoute";
import { BDFDMetadata } from "../../bdfdMetadata";

export default createAPIRoute({
  meta: {
    path: "/bdfd/function/:function",
    methods: ["get"],

    summary: "Get a BDFD function by name",
    description:
      "Fetch detailed information about a specific BDFD function. If no exact match is found, similar functions are suggested.",

    category: "bdfd",
    tags: ["bdfd", "utility"],

    params: {
      function: {
        type: "string",
        required: true,
        description: "Function tag or partial name (case-insensitive)",
        example: "$addButton",
      },
    },

    exampleData: [
      {
        url: "/api/bdfd/function/$addButton",
        method: "get",
        response: {
          exact: true,
          function: {
            tag: "$addButton[]",
            cleanTag: "$addButton[]",
            position: 12,
          },
          matches: ["$addButton[]"],
        },
      },
      {
        url: "/api/bdfd/function/$addButon",
        method: "get",
        response: {
          exact: false,
          function: {
            tag: "$addButton[]",
            cleanTag: "$addButton[]",
            position: 12,
          },
          matches: ["$addButton[]", "$ai[]"],
        },
      },
    ],
  },

  callback(ctx) {
    const query = ctx.req.params.function;

    const result = BDFDMetadata.findFunction(query);

    if (!result.matches.length) {
      return ctx.res.status(404).json({
        error: "Function not found",
      });
    }

    if (result.exact) {
      return ctx.res.json({
        exact: true,
        function: result.matches[0],
        matches: result.matches.map((f) => f.cleanTag),
      });
    }

    return ctx.res.status(404).json({
      exact: false,
      function: result.matches[0],
      matches: result.matches.map((f) => f.cleanTag),
    });
  },
});
