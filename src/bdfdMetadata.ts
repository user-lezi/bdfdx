import { Collection } from "discord.js";

export interface IFunction {
  tag: string;
  cleanTag: string;
  position: number;

  description: {
    short: string;
    long: string;
  };

  arguments: Argument[] | null;

  intents: 0 | 2 | 256;
  premium: boolean;
}

export interface Argument {
  name: string;
  description?: string;
  type: ArgumentType;
  required: boolean;
  repeatable?: boolean;
  empty?: boolean;
  enumData?: unknown;
}

export type ArgumentType =
  | "Bool"
  | "URL | String"
  | "String"
  | "Enum"
  | "Emoji"
  | "Snowflake"
  | "URL"
  | "Integer"
  | "Float | String | Integer"
  | "HowMany"
  | "Tuple"
  | "Snowflake | String"
  | "Permission"
  | "Color"
  | "Duration"
  | "Integer | Float"
  | "String | URL"
  | "String | Snowflake"
  | "Float | Bool | Integer | String"
  | "Float | Integer | String"
  | "String | Bool | Integer | Float"
  | "HowMany | String"
  | "Float | Integer"
  | "Float";

const BASE_URL = "https://botdesignerdiscord.com/public/api";

const Routes = {
  functionList: () => `${BASE_URL}/function_list`,
} as const;

function normalizeTag(tag: string): string {
  const base = tag.split("[")[0];
  return tag.includes("[") ? `${base}[]` : base;
}

export class BDFDMetadata {
  static readonly Functions = new Collection<string, IFunction>();

  static async fetchFunctions(): Promise<Collection<string, IFunction>> {
    const res = await fetch(Routes.functionList());
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = (await res.json()) as any[];
    this.Functions.clear();

    data.forEach((f, index) => {
      if (!f?.tag) return;

      const func: IFunction = {
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

  static getFunctions<T extends boolean>(
    detailed: T,
  ): T extends true ? readonly IFunction[] : readonly string[] {
    const list = [...this.Functions.values()];

    return (detailed ? list : list.map((f) => f.cleanTag)) as any;
  }

  static getFunction(tag: string): IFunction | undefined {
    return this.Functions.get(tag);
  }

  static findFunction(query: string): {
    exact: boolean;
    matches: IFunction[];
  } {
    if (!query) {
      return { exact: false, matches: [] };
    }

    const q = query.toLowerCase();
    const funcs = [...this.Functions.values()];

    // 1️⃣ prefix match
    const prefixMatches = funcs.filter((f) =>
      f.cleanTag.toLowerCase().startsWith(q),
    );

    if (prefixMatches.length) {
      return {
        exact: true,
        matches: prefixMatches.sort(
          (a, b) => a.cleanTag.length - b.cleanTag.length,
        ),
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

function similarityScore(query: string, target: string): number {
  if (target.includes(query)) return query.length * 2;

  let score = 0;
  let qi = 0;

  for (const ch of target) {
    if (ch === query[qi]) {
      score++;
      qi++;
    }
    if (qi >= query.length) break;
  }

  return score;
}
