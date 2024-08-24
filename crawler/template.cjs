/**
 * @param {string} slug 
 * @returns {string}
 */
function normalizeSlug(slug) {
  if (slug.startsWith("/")) {
    slug = slug.substring(1);
  }
  if (slug.endsWith("/")) {
    slug = slug.substring(0, slug.length-1);
  }
  return decodeURIComponent(slug)
}

/**
 * @param {Object<string, string>} entries
 * @param {string[]} tags 
 * @returns 
 */
function generateAstroMarkdownHeadings(entries, tags) {
  let headings = "";
  headings += "---\n"; // open
  for (const [ key, value ] of Object.entries(entries)) {
    if (value) {
      headings += `${key}: ${value}\n`;
    }
  }
  if (tags.length > 0) {
    headings += "tags: \n";
    for (const tag of tags) {
      headings += `  - ${tag}\n`;
    }
  }
  headings += "---\n"; // close
  return headings;
}

module.exports = {
  normalizeSlug,
  generateAstroMarkdownHeadings
}