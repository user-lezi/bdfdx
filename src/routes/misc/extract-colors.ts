import { createCanvas, loadImage } from "@napi-rs/canvas";
import { createAPIRoute } from "../../apiRoute";

type Color = {
  rgb: [number, number, number];
  hex: string;
};

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function toColor(r: number, g: number, b: number): Color {
  return {
    rgb: [r, g, b],
    hex: rgbToHex(r, g, b),
  };
}

export default createAPIRoute({
  meta: {
    path: "/extract-colors",
    method: "get",

    summary: "Extract dominant and accent colors from an image",
    description:
      "Downloads an image and extracts dominant, palette, and accent colors using pixel sampling.",
    category: "utility",
    tags: ["utility", "image"],

    query: {
      image: {
        type: "string",
        description: "The url if the image",
        required: true,
        example: `https://placecats.com/300/200`,
      },
    },

    exampleData: [
      {
        url: "/api/extract-colors?image=https://placecats.com/300/200",
        method: "get",
        response: {
          dominant_color: {
            rgb: [255, 255, 255],
            hex: "#ffffff",
          },
          palette: [
            {
              rgb: [255, 255, 255],
              hex: "#ffffff",
            },
          ],
          accent: {
            primary: {
              rgb: [255, 255, 255],
              hex: "#ffffff",
            },
            secondary: {
              rgb: [255, 255, 255],
              hex: "#ffffff",
            },
          },
          average_color: {
            rgb: [255, 255, 255],
            hex: "#ffffff",
          },
        },
      },
    ],
  },

  async callback(ctx) {
    const imageUrl = ctx.req.query.image as string;

    if (!imageUrl) {
      return ctx.res.status(400).json({
        error: "Missing required query parameter: image",
      });
    }

    const img = await loadImage(imageUrl);

    // Downscale for speed
    const size = 128;
    const canvas = createCanvas(size, size);
    const c = canvas.getContext("2d");

    c.drawImage(img, 0, 0, size, size);
    const { data } = c.getImageData(0, 0, size, size);

    const map = new Map<string, number>();
    const average: [number, number, number] = [0, 0, 0];
    let averageLength = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // ignore transparent / near-transparent
      if (a < 200) continue;

      // reduce noise (color quantization)
      const qr = Math.floor(r / 16) * 16;
      const qg = Math.floor(g / 16) * 16;
      const qb = Math.floor(b / 16) * 16;

      average[0] += qr;
      average[1] += qg;
      average[2] += qb;
      averageLength++;
      const key = `${qr},${qg},${qb}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);

    const colors = sorted.map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return toColor(r, g, b);
    });

    const dominant_color = colors[0];
    const palette = colors.slice(0, 6);

    const accent = {
      primary: colors[1] ?? dominant_color,
      secondary: colors[2] ?? dominant_color,
    };
    const average_color = toColor(
      Math.floor(average[0] / averageLength),
      Math.floor(average[1] / averageLength),
      Math.floor(average[2] / averageLength),
    );

    return ctx.res.json({
      dominant_color,
      palette,
      accent,
      average_color,
    });
  },
});
