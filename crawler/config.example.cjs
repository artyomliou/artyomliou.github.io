const dryRun = true;

const astroLayoutPath = "../../../../layouts/PostLayout.astro";
const imageLocalDir = "./public/";
const markdownLocalDir = "./src/content/post/";
const markdownFileExt = ".md";

const postList = [
  "https://blog.artyomliou.ninja/2023/08/firefox-%e5%9c%a8%e7%b6%b2%e7%ab%99%e4%b8%8a%e7%99%bb%e5%85%a5%e5%a4%9a%e5%80%8b%e5%b8%b3%e8%99%9f/",
];

module.exports = {
  dryRun,
  astroLayoutPath,
  imageLocalDir,
  markdownLocalDir,
  markdownFileExt,
  postList,
}