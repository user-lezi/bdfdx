import { TextBasedChannel, Message } from "discord.js";
import { readdirSync, statSync } from "fs";
import { join } from "path";

export function recursiveReaddir(path: string, depth = -1): string[] {
  const result: string[] = [];

  function walk(currentPath: string, currentDepth: number) {
    if (depth !== -1 && currentDepth > depth) return;

    for (const entry of readdirSync(currentPath)) {
      const fullPath = join(currentPath, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath, currentDepth + 1);
      } else {
        result.push(fullPath);
      }
    }
  }

  walk(path, 0);
  return result;
}

export async function fetchAllMessagesSafe(
  channel: TextBasedChannel,
  opts?: {
    fromUserId?: string;
    before?: string;
    after?: string;
    max?: number;
    delayMs?: number;
  },
): Promise<Message[]> {
  const result: Message[] = [];
  let cursor = opts?.before;
  const max = opts?.max ?? Infinity;

  while (result.length < max) {
    const fetched = await channel.messages.fetch({
      limit: 100,
      before: cursor,
      after: opts?.after,
    });

    if (!fetched.size) break;

    for (const msg of fetched.values()) {
      if (opts?.fromUserId && msg.author.id !== opts.fromUserId) continue;
      result.push(msg);
      if (result.length >= max) break;
    }

    cursor = fetched.last()?.id;

    if (opts?.delayMs) {
      await new Promise((r) => setTimeout(r, opts.delayMs));
    }
  }

  return result;
}
