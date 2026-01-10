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
        else if (file.endsWith(".js") || file.endsWith(".ts"))
            results.push(full);
    }
    return results;
}
// ---------------------------
// Extract route meta from file
// ---------------------------
function extractRouteMeta(filePath) {
    const mod = require(filePath);
    const route = mod.default || mod;
    if (!route?.meta)
        return null;
    return route.meta;
}
// ---------------------------
// Generate table for params, query, body
// ---------------------------
function generateFieldTable(fields, title) {
    if (!fields || Object.keys(fields).length === 0)
        return "";
    const header = `### ${title}\n| Name | Type | Required | Description | Example |\n|------|------|---------|-------------|--------|\n`;
    const rows = Object.entries(fields)
        .map(([name, field]) => {
        const type = field.type;
        const required = field.required ? "✅" : "❌";
        const desc = field.description || "-";
        const example = field.example !== undefined
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
function generateBodyForExample(meta) {
    if (!meta.body)
        return {};
    const obj = {};
    for (const [key, field] of Object.entries(meta.body)) {
        if (field.example !== undefined)
            obj[key] = field.example;
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
function generateExampleBlock(meta) {
    if (!meta.exampleData || meta.exampleData.length === 0)
        return "";
    return meta.exampleData
        .map((ex, i) => {
        let bodyContent = "";
        // Use exampleData.body if present
        if (ex.body) {
            bodyContent =
                "#### Body\n```json\n" + JSON.stringify(ex.body, null, 2) + "\n```\n";
        }
        // Fallback to meta.body if method is mutative and example body missing
        else if (["post", "put", "patch"].includes(ex.method.toLowerCase()) &&
            meta.body) {
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
        return (`### 🧪 Example ${i + 1}\n\`\`\`http\n${ex.method.toUpperCase()} ${ex.url}\n\`\`\`\n` +
            bodyContent +
            responseContent);
    })
        .join("\n");
}
// ---------------------------
// Generate Markdown for route
// ---------------------------
function generateMarkdown(meta, filePath) {
    const header = `# 📘 ${meta.path}\n\n`;
    const summary = `> ${meta.summary ?? "No summary provided."}\n\n`;
    const description = meta.description ? meta.description + "\n\n" : "";
    const methods = `**🛠 Methods:** ${meta.methods.map((m) => "`" + m.toUpperCase() + "`").join(", ")}\n`;
    const tags = meta.tags && meta.tags.length
        ? `**🏷 Tags:** ${meta.tags.join(", ")}\n`
        : "";
    const source = `**📁 Source:** \`${filePath.replace(process.cwd(), "")}\`\n\n`;
    const paramsTable = generateFieldTable(meta.params, "📌 URL Parameters");
    const queryTable = generateFieldTable(meta.query, "🔍 Query Parameters");
    const bodyTable = generateFieldTable(meta.body, "📦 Body Parameters");
    const exampleBlock = generateExampleBlock(meta);
    return (header +
        summary +
        description +
        methods +
        tags +
        source +
        paramsTable +
        queryTable +
        bodyTable +
        exampleBlock +
        "\n> **[Go back to the list of endpoints](./README.md)**");
}
// ---------------------------
// Main generator
// ---------------------------
function generateDocs() {
    console.log(chalk_1.default.blueBright("📄 Generating API documentation...\n"));
    if (fs_1.default.existsSync(DOCS_DIR))
        fs_1.default.rmSync(DOCS_DIR, { recursive: true });
    fs_1.default.mkdirSync(DOCS_DIR);
    const files = recursiveReaddir(ROUTES_DIR);
    const docsIndex = [];
    const endpointsJson = {};
    for (const file of files) {
        const meta = extractRouteMeta(file);
        if (!meta)
            continue;
        const markdown = generateMarkdown(meta, file);
        const safeName = meta.path.slice(1).replace(/[^a-zA-Z0-9]/g, "_") + ".md";
        if (!fs_1.default.existsSync(path_1.default.join(DOCS_DIR, meta.category)))
            fs_1.default.mkdirSync(path_1.default.join(DOCS_DIR, meta.category));
        const docPath = path_1.default.join(DOCS_DIR, meta.category, safeName);
        fs_1.default.writeFileSync(docPath, markdown);
        docsIndex.push(`- [${meta.path}](./${meta.category}/${safeName})`);
        console.log(chalk_1.default.green(`✔ Generated docs for ${meta.path}`));
        endpointsJson[meta.path] = meta;
    }
    fs_1.default.writeFileSync(path_1.default.join(DOCS_DIR, "README.md"), `# 📚 API Documentation\n\n${docsIndex.join("\n")}\n`);
    fs_1.default.writeFileSync(path_1.default.join(DOCS_DIR, "endpoints.json"), JSON.stringify(endpointsJson));
    console.log(chalk_1.default.magentaBright("\n✨ Documentation generation complete!"));
}
generateDocs();
