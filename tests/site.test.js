import test from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { htmlFiles, read, resolves, page, toText, PHONE, OUT } from "./helpers.js";
import { join } from "node:path";

const CONTACT = "contact@joshuahamsa.faith";

test("site produces html pages", () => {
  assert.ok(htmlFiles().length > 0);
});

test("no_phone_numbers", () => {
  for (const file of htmlFiles()) {
    assert.doesNotMatch(toText(read(file)), PHONE, file);
  }
});

test("only_contact_email", () => {
  for (const file of htmlFiles()) {
    const emails = read(file).match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? [];
    for (const email of emails) assert.equal(email, CONTACT, file);
  }
});

test("footer has contact link on every page", () => {
  for (const file of htmlFiles()) {
    assert.ok(read(file).includes(`mailto:${CONTACT}`), file);
  }
});

test("internal_links_resolve", () => {
  for (const file of htmlFiles()) {
    const urls = [...read(file).matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)].map((m) => m[1]);
    for (const url of urls) assert.ok(resolves(url), `${file} -> ${url}`);
  }
});

test("no_trackers", () => {
  for (const file of htmlFiles()) {
    assert.doesNotMatch(read(file), /googletagmanager|google-analytics|www\.youtube\.com\/embed/, file);
  }
});

test("cname_present", () => {
  assert.equal(read(join(OUT, "CNAME")).trim(), "joshuahamsa.faith");
});

const iframes = (html) => html.match(/<iframe\b[^>]*>/g) ?? [];

test("home_features_aig", () => {
  assert.ok(iframes(page("/")).some((f) => f.includes("cTwKtSHD36E")));
});

test("candlelight_first", () => {
  const first = iframes(page("/testimony/"))[0];
  assert.ok(first.includes("cfXkQisIDOo"));
  assert.ok(first.includes("start=478"));
  assert.ok(first.includes("end=1265"));
});

test("embeds_have_titles", () => {
  for (const file of htmlFiles()) {
    for (const frame of iframes(read(file))) assert.match(frame, /\btitle="[^"]+"/, file);
  }
});

test("embeds_lazy", () => {
  for (const file of htmlFiles()) {
    for (const frame of iframes(read(file))) {
      if (file === join(OUT, "index.html") && frame.includes("cTwKtSHD36E")) continue;
      assert.match(frame, /loading="lazy"/, file);
    }
  }
});

test("vimeo_is_a_link_card", () => {
  const html = page("/testimony/");
  assert.ok(html.includes("https://vimeo.com/866911348"));
  assert.ok(!iframes(html).some((f) => f.includes("vimeo")));
});

test("ministry_has_statement_line", () => {
  assert.ok(page("/ministry/").replaceAll("&#39;", "'").replaceAll("’", "'").includes("I'm glad to share my written statement of faith on request."));
});

test("ministry_has_references_line", () => {
  assert.match(page("/ministry/"), /references available on request/i);
});

test("ministry_states_pursuit", () => {
  assert.ok(page("/ministry/").includes("full-time ministry"));
});

test("music_sections_separate", () => {
  const html = page("/music/");
  const recorded = html.indexOf(">Recorded<");
  const ai = html.indexOf(">Made with AI<");
  assert.ok(recorded !== -1 && ai > recorded);
  assert.ok(!html.slice(recorded, ai).includes("suno.com"));
  assert.ok(!html.slice(ai).includes("youtube-nocookie.com"));
  assert.ok(!html.slice(ai).includes("spotify.com"));
});

test("ai_label_present", () => {
  const html = page("/music/");
  assert.match(html.slice(html.indexOf(">Made with AI<")), /made with AI, using Suno/i);
});

test("og_image_exists", () => {
  const image = readFileSync(join(OUT, "assets", "og.png"));
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
});
