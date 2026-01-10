import fs from "fs";
import path from "path";
import chalk from "chalk";

import type { RouteMeta, Field, Method } from "./apiRoute";

const ROUTES_DIR = path.join(__dirname, "routes");
const DOCS_DIR = "docs";

// ---------------------------
// Recursively read directory
// ---------------------------
function recursiveReaddir(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) results = results.concat(recursiveReaddir(full));
    else if (file.endsWith(".js") || file.endsWith(".ts")) results.push(full);
  }

  return results;
}

// ---------------------------
// Extract route meta from file
// ---------------------------
function extractRouteMeta(filePath: string): RouteMeta<any> | null {
  const mod = require(filePath);
  const route = mod.default || mod;

  if (!route?.meta) return null;

  return route.meta;
}

// ---------------------------
// Generate table for params, query, body
// ---------------------------
function generateFieldTable(
  fields?: Record<string, Field>,
  title?: string,
): string {
  if (!fields || Object.keys(fields).length === 0) return "";

  const header = `### ${title}\n| Name | Type | Required | Description | Example |\n|------|------|---------|-------------|--------|\n`;

  const rows = Object.entries(fields)
    .map(([name, field]) => {
      const type = field.type;
      const required = field.required ? "✅" : "❌";
      const desc = field.description || "-";
      const example =
        field.example !== undefined
          ? `\`${JSON.stringify(field.example)}\``
          : "-";
      return `| \`${name}\` | ${type} | ${required} | ${desc} | ${example} |`;
    })
    .join("\n");

  return header + rows + "\n\n";
}

// ---------------------------
// Generate example body from meta.body
// ---------------------------
function generateBodyForExample(meta: RouteMeta<any>): Record<string, unknown> {
  if (!meta.body) return {};
  const obj: Record<string, unknown> = {};

  for (const [key, field] of Object.entries<Field>(meta.body)) {
    if (field.example !== undefined) obj[key] = field.example;
    else {
      // Fallback based on type
      switch (field.type) {
        case "string":
          obj[key] = "string";
          break;
        case "number":
          obj[key] = 0;
          break;
        case "boolean":
          obj[key] = false;
          break;
        case "array":
          obj[key] = [];
          break;
        case "object":
          obj[key] = {};
          break;
        case "enum":
          obj[key] = Object.keys(field.enum || {})[0] ?? "enumValue";
          break;
        default:
          obj[key] = null;
      }
    }
  }

  return obj;
}

// ---------------------------
// Generate example block
// ---------------------------
function generateExampleBlock(meta: RouteMeta<any>): string {
  if (!meta.exampleData || meta.exampleData.length === 0) return "";

  return meta.exampleData
    .map((ex, i) => {
      let bodyContent = "";

      // Use exampleData.body if present
      if (ex.body) {
        bodyContent =
          "#### Body\n```json\n" + JSON.stringify(ex.body, null, 2) + "\n```\n";
      }
      // Fallback to meta.body if method is mutative and example body missing
      else if (
        ["post", "put", "patch"].includes(ex.method.toLowerCase()) &&
        meta.body
      ) {
        bodyContent =
          "#### Body\n```json\n" +
          JSON.stringify(generateBodyForExample(meta), null, 2) +
          "\n```\n";
      }

      const responseContent = ex.response
        ? "#### Response\n```json\n" +
          JSON.stringify(ex.response, null, 2) +
          "\n```\n"
        : "";

      return (
        `### 🧪 Example ${i + 1}\n\`\`\`http\n${ex.method.toUpperCase()} ${ex.url}\n\`\`\`\n` +
        bodyContent +
        responseContent
      );
    })
    .join("\n");
}

// ---------------------------
// Generate Markdown for route
// ---------------------------
function generateMarkdown(meta: RouteMeta<any>, filePath: string): string {
  const header = `# 📘 ${meta.path}\n\n`;
  const summary = `> ${meta.summary ?? "No summary provided."}\n\n`;
  const description = meta.description ? meta.description + "\n\n" : "";
  const methods = `**🛠 Methods:** ${meta.methods.map((m) => "`" + m.toUpperCase() + "`").join(", ")}\n`;
  const tags =
    meta.tags && meta.tags.length
      ? `**🏷 Tags:** ${meta.tags.join(", ")}\n`
      : "";
  const source = `**📁 Source:** \`${filePath.replace(process.cwd(), "")}\`\n\n`;

  const paramsTable = generateFieldTable(meta.params, "📌 URL Parameters");
  const queryTable = generateFieldTable(meta.query, "🔍 Query Parameters");
  const bodyTable = generateFieldTable(meta.body, "📦 Body Parameters");
  const exampleBlock = generateExampleBlock(meta);

  return (
    header +
    summary +
    description +
    methods +
    tags +
    source +
    paramsTable +
    queryTable +
    bodyTable +
    exampleBlock +
    "\n> **[Go back to the list of endpoints](./README.md)**"
  );
}

// ---------------------------
// Main generator
// ---------------------------
function generateDocs() {
  console.log(chalk.blueBright("📄 Generating API documentation...\n"));

  if (fs.existsSync(DOCS_DIR)) fs.rmSync(DOCS_DIR, { recursive: true });
  fs.mkdirSync(DOCS_DIR);

  const files = recursiveReaddir(ROUTES_DIR);
  const docsIndex: string[] = [];

  for (const file of files) {
    const meta = extractRouteMeta(file);
    if (!meta) continue;

    const markdown = generateMarkdown(meta, file);
    const safeName = meta.path.slice(1).replace(/[^a-zA-Z0-9]/g, "_") + ".md";
    const docPath = path.join(DOCS_DIR, safeName);

    fs.writeFileSync(docPath, markdown);
    docsIndex.push(`- [${meta.path}](./${safeName})`);
    console.log(chalk.green(`✔ Generated docs for ${meta.path}`));
  }

  fs.writeFileSync(
    path.join(DOCS_DIR, "README.md"),
    `# 📚 API Documentation\n\n${docsIndex.join("\n")}\n`,
  );
  console.log(chalk.magentaBright("\n✨ Documentation generation complete!"));
}

generateDocs();
