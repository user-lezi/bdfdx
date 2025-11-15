import fs from "fs";
import path from "path";
import chalk from "chalk";

interface RouteInfo {
  file: string;
  path: string;
  description?: string;
  methods: string[];
  query?: Record<string, string>;
  body?: Record<string, string>;
}

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
    else if (file.endsWith(".js")) results.push(full);
  }

  return results;
}

// ---------------------------
// Extract route info from file
// ---------------------------
function extractRouteInfo(filePath: string): RouteInfo | null {
  const mod = require(filePath);
  const route = mod.default || mod;

  const config = route.data ?? {};

  return {
    file: filePath.replace(process.cwd(), ""),
    path: "/api" + config.path,
    methods: config.methods,
    description: config.description,
    query: config.query,
    body: config.body,
  };
}

// ---------------------------
// Generate Markdown
// ---------------------------
function generateMarkdown(route: RouteInfo): string {
  const header = `# 📘 ${route.path}\n`;

  const desc = route.description
    ? `> ${route.description}\n\n`
    : "> No description provided.\n\n";

  const methods = `**🛠 Methods:** ${route.methods
    .map((m) => "`" + m.toUpperCase() + "`")
    .join(", ")}\n`;

  const source = `**📁 Source:** \`${route.file}\`\n`;

  const endpointExample = `
### 🧪 Example  
\`\`\`http
${route.methods[0].toUpperCase()} ${route.path}
\`\`\`
`;

  // Build query table
  let queryTable = "";
  if (route.query && Object.keys(route.query).length > 0) {
    queryTable = `### 🔍 Query Parameters\n| Name | Description |\n|------|-------------|\n${Object.entries(
      route.query,
    )
      .map(([key, desc]) => `| \`${key}\` | ${desc} |`)
      .join("\n")}\n\n`;
  }

  // Build body table
  let bodyTable = "";
  if (route.body && Object.keys(route.body).length > 0) {
    bodyTable = `### 📦 Body Parameters\n| Name | Description |\n|------|-------------|\n${Object.entries(
      route.body,
    )
      .map(([key, desc]) => `| \`${key}\` | ${desc} |`)
      .join("\n")}\n\n`;
  }

  return (
    header + desc + methods + source + endpointExample + queryTable + bodyTable
  );
}

// ---------------------------
// Main Generator
// ---------------------------
function generateDocs() {
  console.log(chalk.blueBright("📄 Generating API documentation...\n"));

  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR);

  const files = recursiveReaddir(ROUTES_DIR);
  const docsIndex: string[] = [];

  for (const file of files) {
    const info = extractRouteInfo(file);
    if (!info) continue;

    const markdown = generateMarkdown(info);
    const safeName =
      info.path.replace("/api/", "").replace(/[^a-zA-Z0-9]/g, "_") + ".md";
    const docPath = path.join(DOCS_DIR, safeName);

    fs.writeFileSync(docPath, markdown);

    docsIndex.push(`- [${info.path}](./${safeName})`);
    console.log(chalk.green(`✔ Generated docs for ${info.path}`));
  }

  // Generate README index
  fs.writeFileSync(
    path.join(DOCS_DIR, "README.md"),
    `# 📚 API Documentation\n\n${docsIndex.join("\n")}\n`,
  );

  console.log(chalk.magentaBright("\n✨ Documentation generation complete!"));
}

generateDocs();
