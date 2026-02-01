import KeyvSqlite from "@keyv/sqlite";
import Keyv from "keyv";

export class Database {
  private stores = new Map<string, Keyv>();
  private adapter: KeyvSqlite;

  constructor(public uri = "sqlite://data.sqlite") {
    this.adapter = new KeyvSqlite({ uri });
  }

  private getStore(namespace: string): Keyv {
    if (!this.stores.has(namespace)) {
      this.stores.set(namespace, new Keyv({ store: this.adapter, namespace }));
    }
    return this.stores.get(namespace)!;
  }

  // ─── BASIC OPS ─────────────────────────────
  async get<T = any>(namespace: string, key: string): Promise<T | null> {
    return (await this.getStore(namespace).get(key)) ?? null;
  }

  async set<T = any>(
    namespace: string,
    key: string,
    value: T,
    options?: { ttl?: number; merge?: boolean },
  ): Promise<void> {
    const store = this.getStore(namespace);

    if (options?.merge && typeof value === "object" && value !== null) {
      const current = (await store.get(key)) ?? {};
      if (typeof current === "object" && current !== null) {
        value = { ...(current as any), ...(value as any) };
      }
    }

    await store.set(key, value, options?.ttl);
  }

  async delete(namespace: string, key: string): Promise<boolean> {
    return this.getStore(namespace).delete(key);
  }

  async has(namespace: string, key: string): Promise<boolean> {
    return this.getStore(namespace).has(key);
  }

  async incr(
    namespace: string,
    key: string,
    path: string,
    by = 1,
  ): Promise<number> {
    const store = this.getStore(namespace);
    const data = (await store.get(key)) ?? {};

    if (typeof data !== "object" || data === null) {
      throw new Error("Cannot increment path on non-object value");
    }

    const parts = path.split(".");
    let ref: any = data;

    for (let i = 0; i < parts.length - 1; i++) {
      ref[parts[i]] ??= {};
      ref = ref[parts[i]];
    }

    const last = parts.at(-1)!;
    ref[last] = (Number(ref[last]) || 0) + by;

    await store.set(key, data);
    return ref[last];
  }

  async setBulk<T = any>(namespace: string, entries: Array<[string, T]>) {
    const store = this.getStore(namespace);
    await Promise.all(entries.map(([k, v]) => store.set(k, v)));
  }

  // ─── ITERATION HELPERS ─────────────────────────────
  private async iterate(namespace: string) {
    const store = this.getStore(namespace);
    const result: Array<[string, any]> = [];
    const iterator = store.iterator;
    if (!iterator) return [];

    for await (const [key, value] of iterator.call(store, undefined)) {
      result.push([key, value]);
    }
    return result;
  }

  async all<T = any>(namespace: string): Promise<Record<string, T>> {
    const entries = await this.iterate(namespace);
    return Object.fromEntries(entries);
  }

  async keys(namespace: string): Promise<string[]> {
    const entries = await this.iterate(namespace);
    return entries.map(([key]) => key);
  }

  async find<T = any>(
    namespace: string,
    fn: (value: T, key: string) => boolean,
  ): Promise<[string, T] | null> {
    const entries = await this.iterate(namespace);
    for (const [key, value] of entries) {
      if (fn(value, key)) return [key, value];
    }
    return null;
  }

  async leaderboard(
    namespace: string,
    path: string,
    options?: { limit?: number; order?: "asc" | "desc" },
  ): Promise<Array<{ key: string; value: number }>> {
    const entries = await this.iterate(namespace);

    const list = entries
      .map(([key, data]) => {
        const value = path.split(".").reduce((o, k) => o?.[k], data);
        return typeof value === "number" ? { key, value } : null;
      })
      .filter(Boolean) as { key: string; value: number }[];

    list.sort((a, b) =>
      options?.order === "asc" ? a.value - b.value : b.value - a.value,
    );

    return options?.limit ? list.slice(0, options.limit) : list;
  }
}

export const db = new Database();
