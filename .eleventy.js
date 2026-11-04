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

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addShortcode("video", videoEmbed);
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
