import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { htmlFiles, read, toText } from "./helpers.js";

const STATEMENT = "raw/statement-of-faith.html";
const hasRaw = existsSync("raw");
const words = (text) => text.toLowerCase().replaceAll("’", "'").match(/[\p{L}\p{N}']+/gu) ?? [];

test("private statement is present when raw/ exists", { skip: !hasRaw }, () => {
  assert.ok(existsSync(STATEMENT), `${STATEMENT} is missing, so the private-text check cannot run`);
});

test("private text is not published", { skip: !existsSync(STATEMENT) }, () => {
  const published = ` ${htmlFiles().map((f) => words(toText(read(f))).join(" ")).join(" ")} `;
  const source = words(toText(read(STATEMENT)));
  assert.ok(source.length >= 8);
  for (let i = 0; i + 8 <= source.length; i++) {
    const run = source.slice(i, i + 8).join(" ");
    assert.ok(!published.includes(` ${run} `), `Private text found in site at word ${i}`);
  }
});
