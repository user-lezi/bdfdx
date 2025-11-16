"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ROUTES_DIR = path_1.default.join(__dirname, "routes");
const DOCS_DIR = "docs";
// ---------------------------
// Recursively read directory
// ---------------------------
function recursiveReaddir(dir) {
    let results = [];
    const list = fs_1.default.readdirSync(dir);
    for (const file of list) {
        const full = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(full);
        if (stat.isDirectory())
            results = results.concat(recursiveReaddir(full));
        else if (file.endsWith(".js"))
            results.push(full);
    }
    return results;
}
// ---------------------------
// Extract route info from file
// ---------------------------
function extractRouteInfo(filePath) {
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
function generateMarkdown(route) {
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
        queryTable = `### 🔍 Query Parameters\n| Name | Description |\n|------|-------------|\n${Object.entries(route.query)
            .map(([key, desc]) => `| \`${key}\` | ${desc} |`)
            .join("\n")}\n\n`;
    }
    // Build body table
    let bodyTable = "";
    if (route.body && Object.keys(route.body).length > 0) {
        bodyTable = `### 📦 Body Parameters\n| Name | Description |\n|------|-------------|\n${Object.entries(route.body)
            .map(([key, desc]) => `| \`${key}\` | ${desc} |`)
            .join("\n")}\n\n`;
    }
    return (header + desc + methods + source + endpointExample + queryTable + bodyTable);
}
// ---------------------------
// Main Generator
// ---------------------------
function generateDocs() {
    console.log(chalk_1.default.blueBright("📄 Generating API documentation...\n"));
    if (fs_1.default.existsSync(DOCS_DIR))
        fs_1.default.rmSync(DOCS_DIR, { recursive: true });
    fs_1.default.mkdirSync(DOCS_DIR);
    const files = recursiveReaddir(ROUTES_DIR);
    const docsIndex = [];
    for (const file of files) {
        const info = extractRouteInfo(file);
        if (!info)
            continue;
        const markdown = generateMarkdown(info);
        const safeName = info.path.replace("/api/", "").replace(/[^a-zA-Z0-9]/g, "_") + ".md";
        const docPath = path_1.default.join(DOCS_DIR, safeName);
        fs_1.default.writeFileSync(docPath, markdown);
        docsIndex.push(`- [${info.path}](./${safeName})`);
        console.log(chalk_1.default.green(`✔ Generated docs for ${info.path}`));
    }
    // Generate README index
    fs_1.default.writeFileSync(path_1.default.join(DOCS_DIR, "README.md"), `# 📚 API Documentation\n\n${docsIndex.join("\n")}\n`);
    console.log(chalk_1.default.magentaBright("\n✨ Documentation generation complete!"));
}
generateDocs();
