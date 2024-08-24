const fs = require('node:fs');
const path = require('node:path');
const { dryRun, imageLocalDir } = require("./config.cjs");

function getImagePaths(url) {
  const pathname = decodeURIComponent(new URL(url).pathname);
  let localPath = "";
  if (pathname.startsWith("/")) {
    localPath = pathname.replace("/", imageLocalDir);
  } else {
    localPath = imageLocalDir + pathname;
  }
  return {
    pathname,
    localPath,
  }
}

/**
 * @param {string} url 
 * @param {string} localPath 
 */
async function fetchImage(url, localPath) {
  if (dryRun) {
    console.info(`dry run: will fetch ${url} to ${localPath}`);
    return;
  }

  const resp = await fetch(url);
  const blob = await resp.blob();
  buf = await blob.arrayBuffer();
  saveTo(localPath, new DataView(buf));
}

function saveTo(pathname, savable) {
  if ((""+pathname).startsWith("/")) {
    throw new Error(`Local pathname must start with "./" (${pathname})`);
  }

  const dir = path.dirname(pathname);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(pathname, savable);
  console.log(`saved ${pathname}!`);
}

module.exports = {
  getImagePaths,
  fetchImage,
  saveTo
}