---
layout: ../../../../layouts/PostLayout.astro
title: <img loading=”lazy”>
slug: 2022/04/img-lazy-loading
date: 2022/4/6
category: html
tags: 
  - lessimggreater
  - lazy-loading
---

  
在 2022 年的現在，主流瀏覽器都[原生支援 <img> 的 lazy loading](https://caniuse.com/loading-lazy-attr) 了<br>
所以在有大量圖片的網頁中，都可以直接為 <img> 加上 loading=”lazy” 來優化網頁效能<br>
但最好[別在網頁第一眼所見範圍的圖片開啟這功能](https://web.dev/browser-level-image-lazy-loading/#avoid-lazy-loading-images-that-are-in-the-first-visible-viewport)







  
一般讀取網頁時的執行路徑是：



  
Parse HTML ➡ Download images ➡ Layout ➡ Ready



<br><br>



  
正確設定 lazy loading 時的執行路徑是：



  
Parse HTML ➡ Layout ➡ Ready<br>
直到使用者 scroll down 到一定的深度而觸發 lazy loading ➡ Download images ➡ Layout



<br><br>



  
但在首屏圖片開啟 lazy loading 的執行路徑是：



  
Parse HTML ➡ Layout ➡ Download images ➡ Layout<br>
無可避免的多做一次 layout 惹，no good



<br><br>



  




  
題外話，在 [Firefox 57 發布](https://www.ithome.com.tw/news/118260)之後使用起來順暢超級多，像是我第一次用 Chrome 的感覺 😂<br>
在 2017 年官方部落格有一篇 [Inside a super fast CSS engine: Quantum CSS (aka Stylo)](https://hacks.mozilla.org/2017/08/inside-a-super-fast-css-engine-quantum-css-aka-stylo/) 講解一般瀏覽器在讀取網頁時要做的事情，以及 Firefox 新的 CSS 引擎如何優化這個過程，我覺得讀起來是蠻有趣的啦
