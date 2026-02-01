"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BDFDMetadata = void 0;
const discord_js_1 = require("discord.js");
const BASE_URL = "https://botdesignerdiscord.com/public/api";
const Routes = {
    functionList: () => `${BASE_URL}/function_list`,
};
function normalizeTag(tag) {
    const base = tag.split("[")[0];
    return tag.includes("[") ? `${base}[]` : base;
}
class BDFDMetadata {
    static Functions = new discord_js_1.Collection();
    static async fetchFunctions() {
        const res = await fetch(Routes.functionList());
        if (!res.ok)
            throw new Error(`Fetch failed: ${res.status}`);
        const data = (await res.json());
        this.Functions.clear();
        data.forEach((f, index) => {
            if (!f?.tag)
                return;
            const func = {
                tag: f.tag,
                cleanTag: normalizeTag(f.tag),
                position: index,
                description: {
                    short: f.shortDescription ?? "",
                    long: f.longDescription ?? "",
                },
                arguments: Array.isArray(f.arguments) ? f.arguments : null,
                intents: f.intents,
                premium: Boolean(f.premium),
            };
            this.Functions.set(func.cleanTag, func);
        });
        return this.Functions;
    }
    static getFunctions(detailed) {
        const list = [...this.Functions.values()];
        return (detailed ? list : list.map((f) => f.cleanTag));
    }
    static getFunction(tag) {
        return this.Functions.get(tag);
    }
    static findFunction(query) {
        if (!query) {
            return { exact: false, matches: [] };
        }
        const q = query.toLowerCase();
        const funcs = [...this.Functions.values()];
        // 1️⃣ prefix match
        const prefixMatches = funcs.filter((f) => f.cleanTag.toLowerCase().startsWith(q));
        if (prefixMatches.length) {
            return {
                exact: true,
                matches: prefixMatches.sort((a, b) => a.cleanTag.length - b.cleanTag.length),
            };
        }
        // 2️⃣ closest matches (similarity score)
        const scored = funcs
            .map((f) => ({
            fn: f,
            score: similarityScore(q, f.cleanTag.toLowerCase()),
        }))
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map((x) => x.fn);
        return {
            exact: false,
            matches: scored,
        };
    }
}
exports.BDFDMetadata = BDFDMetadata;
function similarityScore(query, target) {
    if (target.includes(query))
        return query.length * 2;
    let score = 0;
    let qi = 0;
    for (const ch of target) {
        if (ch === query[qi]) {
            score++;
            qi++;
        }
        if (qi >= query.length)
            break;
    }
    return score;
}
