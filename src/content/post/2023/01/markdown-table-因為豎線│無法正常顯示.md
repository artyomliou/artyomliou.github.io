---
layout: ../../../../layouts/PostLayout.astro
title: JS console.table() 的豎線不是一般豎線
imgSrc: /wp-content/uploads/2023/01/Screenshot-2023-08-19-at-11-34-02-Online-Node.js-Compiler-node.png
slug: 2023/01/markdown-table-因為豎線│無法正常顯示
date: 2023/1/7
category: 寫程式
tags: 
  - markdown
  - nodejs
---

  
今天在寫 [benchmark-js-object-addition](https://github.com/artyomliou/benchmark-js-object-addition) 的文件時<br>
因為我是把 `console.table()` 顯示出來的字複製起來，想要當成 Markdown 格式的表格。但它使用豎線不是我們鍵盤可以直接打出來的「|」而是本篇標題的「│」



  
用 [Unicode code converter](https://r12a.github.io/app-conversion/) 看各種豎線的結果：



  
  
 | 符號 | 意義 | 代號 |  
 | --- | --- | --- |   
 | | | 鍵盤打出來的半形豎線 | [0x7c](https://unicodemap.org/details/0x007c/index.html) |  
 | ｜ | 鍵盤打出來的全型豎線 | [0xff5c](https://unicodemap.org/details/0xFF5C/index.html) |  
 | │ | `console.table()` 丟出來的豎線 | [0x2502](https://unicodemap.org/details/0x2502/index.html)



  
總之把這奇怪的豎線改掉就能正常顯示了，無言
