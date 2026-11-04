import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const OUT = "_site";

export function htmlFiles(dir = OUT) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...htmlFiles(path));
    else if (entry.name.endsWith(".html")) found.push(path);
  }
  return found;
}

export const read = (path) => readFileSync(path, "utf8");

export function page(route) {
  const path = route === "/" ? join(OUT, "index.html") : join(OUT, route, "index.html");
  return read(path);
}

export function toText(html) {
  return html
    .replace(/<(script|style|nav|footer)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:rsquo|apos|#39|#x27);/gi, "'")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolves(url) {
  const clean = url.split(/[?#]/)[0];
  if (clean === "/") return existsSync(join(OUT, "index.html"));
  if (existsSync(join(OUT, clean)) && !clean.endsWith("/")) return true;
  return existsSync(join(OUT, clean, "index.html"));
}

export const PHONE = /(?:\(\d{3}\)\s*|\b\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}\b/;
