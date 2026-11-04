import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { PHONE, page, toText } from "./helpers.js";

test("phone pattern catches common US formats", () => {
  for (const sample of ["805-555-1212", "805.555.1212", "805 555 1212", "(805) 555-1212", "(805)555-1212", "8055551212"]) {
    assert.match(sample, PHONE, sample);
  }
});

test("phone pattern ignores years and short numbers", () => {
  for (const sample of ["2017 to 2019", "start=2610", "27 kW"]) {
    assert.doesNotMatch(sample, PHONE, sample);
  }
});

test("toText keeps apostrophes from entities", () => {
  assert.equal(toText("<p>Lord&rsquo;s word&#39;s</p>"), "Lord's word's");
});

test("no private or working paths are tracked", () => {
  const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n");
  const bad = tracked.filter((path) => /^(raw|docs|\.superpowers|\.remember)\//.test(path));
  assert.deepEqual(bad, []);
});

test("home dates past roles", () => {
  const text = toText(page("/"));
  assert.ok(text.includes("Grace Chapel Pasadena (2017 to 2019)"));
  assert.ok(text.includes("Freedom Church (2020 to 2021)"));
});

test("music intro does not claim every recording was as MC Hamsa", () => {
  assert.ok(!toText(page("/music/")).includes("Songs I wrote and recorded under the name MC Hamsa"));
});

test("site does not name current employer", () => {
  assert.doesNotMatch(toText(page("/ministry/")), /Currently [^.]* at /);
});
