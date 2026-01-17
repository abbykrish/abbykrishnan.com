import type { UserConfig } from "@11ty/eleventy";

export default function(eleventyConfig: UserConfig) {
  // Add TypeScript as a valid data file extension
  eleventyConfig.addDataExtension("ts", {
    parser: async (contents: string, filePath: string) => {
      const mod = await import(filePath);
      if (typeof mod.default === "function") {
        return mod.default();
      }
      return mod.default;
    },
    read: false
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/resume.pdf": "resume.pdf" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-32x32.png": "favicon-32x32.png" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-16x16.png": "favicon-16x16.png" });

  // Date filter
  eleventyConfig.addFilter("dateFormat", (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Create a collection of posts sorted by date
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return (b.date as Date).getTime() - (a.date as Date).getTime();
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
