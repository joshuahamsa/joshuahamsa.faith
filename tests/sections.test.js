import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { page, OUT } from "./helpers.js";

const OFF = ["preaching", "testimony-work", "statement", "journey"];

test("launch config enables only testimony, ministry, and music", () => {
  const { sections } = JSON.parse(readFileSync("site.config.json", "utf8"));
  const enabled = Object.keys(sections).filter((key) => sections[key]).sort();
  assert.deepEqual(enabled, ["ministry", "music", "testimony"]);
});

test("disabled sections produce no output", () => {
  for (const route of OFF) assert.ok(!existsSync(join(OUT, route)), route);
  assert.ok(!existsSync(join(OUT, "feed.xml")));
});

test("nav omits disabled sections", () => {
  const nav = page("/").match(/<nav[\s\S]*?<\/nav>/)[0];
  for (const route of OFF) assert.ok(!nav.includes(`/${route}/`), route);
});

test("all sections build when enabled", () => {
  const out = mkdtempSync(join(tmpdir(), "faith-site-"));
  try {
    execFileSync("npx", ["eleventy", `--output=${out}`], {
      env: { ...process.env, ELEVENTY_ALL_SECTIONS: "1" },
      stdio: "pipe",
    });
    for (const route of OFF) assert.ok(existsSync(join(out, route, "index.html")), route);
    assert.ok(existsSync(join(out, "journey", "fixture-post", "index.html")));
    assert.ok(readFileSync(join(out, "feed.xml"), "utf8").includes("Fixture post"));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
