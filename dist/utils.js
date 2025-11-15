"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recursiveReaddir = recursiveReaddir;
const fs_1 = require("fs");
const path_1 = require("path");
function recursiveReaddir(path, depth = -1) {
    const result = [];
    function walk(currentPath, currentDepth) {
        if (depth !== -1 && currentDepth > depth)
            return;
        for (const entry of (0, fs_1.readdirSync)(currentPath)) {
            const fullPath = (0, path_1.join)(currentPath, entry);
            const stat = (0, fs_1.statSync)(fullPath);
            if (stat.isDirectory()) {
                walk(fullPath, currentDepth + 1);
            }
            else {
                result.push(fullPath);
            }
        }
    }
    walk(path, 0);
    return result;
}
