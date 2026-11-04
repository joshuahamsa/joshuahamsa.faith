const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function videoEmbed(entry, options = {}) {
  const title = escapeHtml(entry.title);
  if (entry.host === "vimeo") {
    return `<p class="link-card"><a href="https://vimeo.com/${entry.videoId}">Watch “${title}” on Vimeo</a></p>`;
  }
  const params = new URLSearchParams({ rel: "0" });
  if (entry.start !== undefined) params.set("start", entry.start);
  if (entry.end !== undefined) params.set("end", entry.end);
  const loading = options.eager ? "" : ' loading="lazy"';
  return (
    `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${entry.videoId}?${params.toString().replaceAll("&", "&amp;")}"` +
    ` title="${title}"${loading} allow="encrypted-media; picture-in-picture; fullscreen"` +
    ` referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`
  );
}

function videoCard(entry) {
  const title = escapeHtml(entry.title);
  const church = entry.church ? `<span>${escapeHtml(entry.church)}</span>` : "";
  const date = entry.date ? `<span>${escapeHtml(entry.date)}</span>` : "";
  const meta = church || date ? `<p class="card-meta">${[church, date].filter(Boolean).join("<span aria-hidden=\"true\">·</span>")}</p>` : "";
  const isVimeo = entry.host === "vimeo";
  const watchUrl = isVimeo ? `https://vimeo.com/${entry.videoId}` : `https://www.youtube.com/watch?v=${entry.videoId}`;
  const media = isVimeo
    ? '<div class="video-card-fallback" aria-hidden="true"><span>Watch on Vimeo</span></div>'
    : `<img src="https://i.ytimg.com/vi/${entry.videoId}/hqdefault.jpg" alt="" loading="lazy">`;

  return (
    `<article class="video-card">` +
    `<a class="video-card-media" href="${watchUrl}" aria-label="Watch ${title}">${media}</a>` +
    `<div class="video-card-body"><p class="card-kicker">${isVimeo ? "Vimeo" : "Video"}</p><h2>${title}</h2>${meta}` +
    `<a class="card-action" href="${watchUrl}">Watch <span aria-hidden="true">↗</span></a></div></article>`
  );
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addShortcode("video", videoEmbed);
  eleventyConfig.addShortcode("videoCard", videoCard);
  eleventyConfig.addFilter("rfc822", (date) => new Date(date).toUTCString());
  eleventyConfig.addFilter("longDate", (date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
  );
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("post").sort((a, b) => b.date - a.date),
  );

  // A template with `section: <key>` builds only when that section is switched on.
  eleventyConfig.addPreprocessor("section-switch", "*", (data) => {
    if (data.section && !data.site.sections[data.section]) return false;
  });

  if (process.env.ELEVENTY_ALL_SECTIONS === "1") {
    eleventyConfig.addTemplate("journey/fixture-post.md", "Fixture body.", {
      layout: "post.njk",
      section: "journey",
      tags: ["post"],
      title: "Fixture post",
      summary: "Used only by the test suite.",
      date: "2026-01-01",
      permalink: "/journey/fixture-post/",
    });
  }

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
