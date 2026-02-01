"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Database = void 0;
const sqlite_1 = __importDefault(require("@keyv/sqlite"));
const keyv_1 = __importDefault(require("keyv"));
class Database {
    uri;
    stores = new Map();
    adapter;
    constructor(uri = "sqlite://data.sqlite") {
        this.uri = uri;
        this.adapter = new sqlite_1.default({ uri });
    }
    getStore(namespace) {
        if (!this.stores.has(namespace)) {
            this.stores.set(namespace, new keyv_1.default({ store: this.adapter, namespace }));
        }
        return this.stores.get(namespace);
    }
    // ─── BASIC OPS ─────────────────────────────
    async get(namespace, key) {
        return (await this.getStore(namespace).get(key)) ?? null;
    }
    async set(namespace, key, value, options) {
        const store = this.getStore(namespace);
        if (options?.merge && typeof value === "object" && value !== null) {
            const current = (await store.get(key)) ?? {};
            if (typeof current === "object" && current !== null) {
                value = { ...current, ...value };
            }
        }
        await store.set(key, value, options?.ttl);
    }
    async delete(namespace, key) {
        return this.getStore(namespace).delete(key);
    }
    async has(namespace, key) {
        return this.getStore(namespace).has(key);
    }
    async incr(namespace, key, path, by = 1) {
        const store = this.getStore(namespace);
        const data = (await store.get(key)) ?? {};
        if (typeof data !== "object" || data === null) {
            throw new Error("Cannot increment path on non-object value");
        }
        const parts = path.split(".");
        let ref = data;
        for (let i = 0; i < parts.length - 1; i++) {
            ref[parts[i]] ??= {};
            ref = ref[parts[i]];
        }
        const last = parts.at(-1);
        ref[last] = (Number(ref[last]) || 0) + by;
        await store.set(key, data);
        return ref[last];
    }
    async setBulk(namespace, entries) {
        const store = this.getStore(namespace);
        await Promise.all(entries.map(([k, v]) => store.set(k, v)));
    }
    // ─── ITERATION HELPERS ─────────────────────────────
    async iterate(namespace) {
        const store = this.getStore(namespace);
        const result = [];
        const iterator = store.iterator;
        if (!iterator)
            return [];
        for await (const [key, value] of iterator.call(store, undefined)) {
            result.push([key, value]);
        }
        return result;
    }
    async all(namespace) {
        const entries = await this.iterate(namespace);
        return Object.fromEntries(entries);
    }
    async keys(namespace) {
        const entries = await this.iterate(namespace);
        return entries.map(([key]) => key);
    }
    async find(namespace, fn) {
        const entries = await this.iterate(namespace);
        for (const [key, value] of entries) {
            if (fn(value, key))
                return [key, value];
        }
        return null;
    }
    async leaderboard(namespace, path, options) {
        const entries = await this.iterate(namespace);
        const list = entries
            .map(([key, data]) => {
            const value = path.split(".").reduce((o, k) => o?.[k], data);
            return typeof value === "number" ? { key, value } : null;
        })
            .filter(Boolean);
        list.sort((a, b) => options?.order === "asc" ? a.value - b.value : b.value - a.value);
        return options?.limit ? list.slice(0, options.limit) : list;
    }
}
exports.Database = Database;
exports.db = new Database();
