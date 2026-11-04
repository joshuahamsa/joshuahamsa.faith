import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync("site.config.json", "utf8"));

if (process.env.ELEVENTY_ALL_SECTIONS === "1") {
  for (const key of Object.keys(config.sections)) config.sections[key] = true;
}

export default config;
