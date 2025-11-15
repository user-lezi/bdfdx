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
