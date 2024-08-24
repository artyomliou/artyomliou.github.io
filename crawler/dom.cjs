const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { getImagePaths, fetchImage } = require("./file.cjs");

function Dom(html) {
  this.dom = new JSDOM(html);

  /**
   * @returns {string | undefined}
   */
  this.findPostImageUrl = function() {
    return this.dom.window.document.querySelector("img.wp-post-image")?.src;
  }

  /**
   * @returns {string | undefined}
   */
  this.findPostTitle = function () {
    return this.dom.window.document.querySelector("h1.wp-block-post-title")?.textContent;
  }

  /**
   * @returns {HTMLDivElement}
   */
  this.findPostContentElement = function () {
    const el = this.dom.window.document.querySelector("div.wp-block-post-content");
    if (!el) {
      throw new Error("cannot find post content");
    }
    return el;
  }

  /**
   * @returns {Date}
   */
  this.findPostDate = function () {
    /** @type {Element} */
    const el = this.dom.window.document.querySelector('time');
    if (!el) {
      throw new Error("cannot find post date");
    }
    const datetime = el.attributes.getNamedItem('datetime');
    if (! datetime) {
      throw new Error("<time> does not have datetime attribute");
    }
    return new Date(datetime.textContent);
  }

  /**
   * @returns {string}
   */
  this.findPostCategory = function () {
    const el = this.dom.window.document.querySelector("div.taxonomy-category a[rel=tag]");
    if (!el) {
      throw new Error("cannot find post category");
    }
    return el.textContent;
  }

  /**
   * @returns {string[]}
   */
  this.findPostTags = function () {
    /** @type {NodeList} */
    const elements = this.dom.window.document.querySelectorAll("div.taxonomy-post_tag a[rel=tag]");
    return Array.from(elements).map(el => el.textContent);
  }

  return this
}

/**
 * @param {Node} node 
 * @yields {Node}
 */
function* traversePreOrder(node) {
  if (!node) return;

  let stack = [];
  stack.push(node);

  /** @type {Node} */
  let cur;
  while (stack.length > 0) {
    try {
      yield cur = stack.pop();
    } catch (error) {
      console.error(error);
      yield null; // wait here, otherwise, next element in stack may be yield from throw()
      continue;
    }
    // from right to left
    for (const child of Array.from(cur.childNodes).reverse()) {
      stack.push(child);
    }
  }
}

/**
 * @param {Node} root 
 * @returns 
 */
async function transpileHtmlToMarkdown(root) {
  const NEWLINE = "  \n";
  const LINEBREAK = "<br>\n";

  let olIndex = 0;
  let tdIndex = 0;
  let tdCount = 0;
  let final = "";

  /** @type {Generator<Node>} */
  const generator = traversePreOrder(root);
  for (const node of generator) {
    if (node === null) {
      continue;
    }

    if (node.nodeType === 3 /* Node.TEXT_NODE */) {
      final += node.textContent;
      continue;
    } else if (node.nodeType !== 1 /* Node.ELEMENT_NODE */) {
      throw new Error(`unhandled node type ${node.nodeType}`);
    }

    // from now on, treat node as HTMLElement
    /** @type {HTMLElement}  */
    const el = node;

    switch (el.tagName) {
      case "SUMMARY":
      case "DETAILS":
      case "FIGURE":
      case "FIGCAPTION":
      case "THEAD":
      case "TBODY":
      case "TFOOT":
      case "DL":
      case "DT":
      case "DD":
      case "UL":
        continue; // skip
    }

    // block element
    if (el.tagName == "DIV") {
      const keepTraversing = 
        el.classList.contains("wp-block-post-content") || 
        el.classList.contains("wp-block-columns") || 
        el.classList.contains("wp-block-column") ||
        el.classList.contains("wp-block-embed__wrapper");
      if (keepTraversing) {
        continue; // keep traversing
      } else if (el.classList.contains("sharedaddy")) {
        generator.return("skip div.sharedaddy");
        continue;
      } else if (el.classList.contains("wp-block-spacer")) {
        final += "<br><br>";
        continue;
      } else {
        throw new Error(`unhandled <DIV>: ${el.outerHTML}`);
      }

    } else if (el.tagName == "P") {
      final += NEWLINE;
      continue;

    } else if (el.tagName == "H1") {
      final += NEWLINE + "# ";
      continue;

    } else if (el.tagName == "H2") {
      final += NEWLINE + "## ";
      continue;

    } else if (el.tagName == "H3") {
      final += NEWLINE + "### ";
      continue;

    } else if (el.tagName == "H4") {
      final += NEWLINE + "#### ";
      continue;

    } else if (el.tagName == "H5") {
      final += NEWLINE + "##### ";
      continue;

    } else if (el.tagName == "H6") {
      final += NEWLINE + "###### ";
      continue;

    } else if (el.tagName == "HR") {
      final += NEWLINE;
      continue;

    } else if (el.tagName == "BLOCKQUOTE") {
      final += NEWLINE + "> ";
      continue;

    } else if (el.tagName == "PRE") {
      final += NEWLINE + "```\n" + el.textContent + "\n```";
      generator.throw("handled <PRE>");
      continue;

    } else if (el.tagName == "TABLE") {
      final += NEWLINE;
      continue;
    } else if (el.tagName == "TR") {
      if (tdIndex > 0 && tdCount > 0 && tdIndex >= tdCount) {
        final += " |";
        tdIndex = 0;
        tdCount = 0;
      }

      // keep track of <td>
      tdIndex = 0;
      tdCount = el.querySelectorAll("td,th").length;

      // if this is second row, append divider
      if (el.parentElement.children[1] === el) {
        final += NEWLINE + " | " + new Array(tdCount).fill("---").join(" | ") + " | ";
      }

      final += NEWLINE;

      continue;
    } else if (el.tagName == "TD" || el.tagName == "TH") {
      final += " | ";
      tdIndex++;
      continue;
      
    } else if (el.tagName == "OL") {
      olIndex = 0;
      continue;

    } else if (el.tagName == "LI") {
      const indent = "  ".repeat(countNestedParentList(el.parentElement));

      let prefix = "";
      if (el.parentElement.tagName == "OL") {
        olIndex++;
        prefix = `${olIndex}.`;
      } else {
        prefix = `-`;
      }

      final += NEWLINE + `${indent}${prefix} `;
      continue;
      
    }

    // inline element
    let tmp = "";
    if (el.tagName == "STRONG") {
      // workaround: if a <a> is inside <strong>, skip this <strong>
      if (el.querySelectorAll("a").length > 0) {
        continue;
      }

      tmp = `**${el.textContent}**`;

    } else if (el.tagName == "S") {
      tmp = `~~${el.textContent}~~`;

    } else if (el.tagName == "EM") {
      tmp = `_${el.textContent}_`;

    } else if (el.tagName == "SUP" || el.tagName == "SUB") {
      tmp = el.outerHTML;

    } else if (el.tagName == "MARK") {
      tmp = el.textContent;

    } else if (el.tagName == "CODE") {
      tmp = "`" + el.textContent + "`";

    } else if (el.tagName == "A") {
      // workaround: if a <a> is inside <strong>, skip this <strong>
      if (el.querySelectorAll("img").length > 0) {
        continue;
      }

      tmp = `[${el.textContent}](${el.href})`;

    } else if (el.tagName == "SPAN") {
      if (el.id.startsWith("more-")) {
        continue; // workaround: skip unknown element
      } else if (el.classList.length == 0) {
        tmp = el.textContent;
      } else {
        throw new Error(`unhandled <SPAN>.${el.classList} ${el.textContent}`);
      }

    } else if (el.tagName == "BR") {
      tmp = LINEBREAK;

    } else if (el.tagName == "IMG") {
      const { pathname, localPath } = getImagePaths(el.src);
      await fetchImage(el.src, localPath);
      tmp = `![${el.alt}](${pathname})`;

    } else if (el.tagName == "SCRIPT" || el.tagName == "IFRAME") {
      tmp = el.outerHTML;

    } else {
      throw new Error(`unhandled tagName ${el.tagName}`);
    }
    if (tmp) {
      final += tmp;
      // for inline element, we implicitly handle inner TEXT_NODE with node.textContent, so will not go deeper
      generator.throw(`handled inline element <${el.tagName}>, skip traversing for TEXT_NODE`);
    }
  }
  
  return final;
}

/**
 * @param {HTMLElement} node 
 * @returns {Number}
 */
function countNestedParentList(node) {
  let cnt = 0;
  while (node.parentElement) {
    if (node.parentElement.tagName == "UL" || node.parentElement.tagName == "OL") {
      cnt++;
    }
    node = node.parentElement;
  }
  return cnt;
}

module.exports = {
  Dom,
  transpileHtmlToMarkdown,
};