const { Dom, transpileHtmlToMarkdown } = require("./dom.cjs");
const { getImagePaths, fetchImage, saveTo } = require("./file.cjs");
const { normalizeSlug, generateAstroMarkdownHeadings } = require("./template.cjs");
const { dryRun, astroLayoutPath, markdownLocalDir, markdownFileExt, postList } = require("./config.cjs");

const slugify = require("slugify");
function customizedSlugify(str) {
  return slugify(str, {
    lower: true,
  });
}


/**
 * @param {string} url 
 */
async function wordpressPageToMarkdown(url) {
  console.info(`processing ${url}`);

  const urlObj = new URL(url);
  const slug = normalizeSlug(urlObj.pathname);

  const resp = await fetch(url);
  const html = await resp.text();
  const dom = new Dom(html);

  // find post metadata for headings
  const title = dom.findPostTitle();

  let imgSrc = "";
  const postImgSrc = dom.findPostImageUrl();
  if (postImgSrc) {
    const { pathname, localPath } = getImagePaths(postImgSrc);
    await fetchImage(postImgSrc, localPath);
    imgSrc = pathname;
  }

  const date = dom.findPostDate();
  const category = customizedSlugify(dom.findPostCategory());
  const tags = dom.findPostTags().map(tag => customizedSlugify(tag));
  const headings = {
    layout: astroLayoutPath,
    title,
    imgSrc,
    slug,
    date: `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`,
    category: category.toLowerCase(),
  };
  const mdHeadings = generateAstroMarkdownHeadings(headings, tags);
  const mdContent = await transpileHtmlToMarkdown(dom.findPostContentElement());

  if (dryRun) {
    console.debug(`markdown headings:\n${mdHeadings}`);
    console.debug(`markdown content:\n${mdContent}`);
  }
  
  const mdLocalPath = `${markdownLocalDir}${slug}${markdownFileExt}`;
  if (dryRun) {
    console.info(`dry run: will save markdown to ${mdLocalPath}`);
  } else {
    saveTo(mdLocalPath, mdHeadings + mdContent);
  }
}



async function main() {
  for (let i = 0; i < postList.length; i++) {
    const url = postList[i];
    await wordpressPageToMarkdown(url, true);
  }
}

main();