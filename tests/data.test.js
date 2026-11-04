import test from "node:test";
import assert from "node:assert/strict";
import { read } from "./helpers.js";

const videos = JSON.parse(read("src/_data/videos.json"));

test("exactly_one_featured", () => {
  assert.equal(videos.filter((v) => v.featured).length, 1);
});

test("end_after_start", () => {
  for (const v of videos) {
    if (v.start !== undefined && v.end !== undefined) assert.ok(v.end > v.start, v.key);
  }
});

test("keys_unique", () => {
  const keys = videos.map((v) => v.key);
  assert.equal(new Set(keys).size, keys.length);
});
