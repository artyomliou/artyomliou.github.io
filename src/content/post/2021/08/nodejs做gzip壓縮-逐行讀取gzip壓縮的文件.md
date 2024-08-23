---
layout: ../../../../layouts/PostLayout.astro
title: Nodejs Gzip壓縮+逐行讀取Gzip壓縮的文件
imgSrc: 
slug: 2021/08/nodejs做gzip壓縮-逐行讀取gzip壓縮的文件
---

  
紀錄一下跟 gzip 有關的 snippet<br>
比如 AWS Data Firehose 蒐集的事件會一行一行的存在文件裡，並用 gzip 壓縮。<br>
當要讀取原文的時候，就是用 gunzip 解壓縮再用 readline 一行一行讀取







  
比如說原文是這樣



  
```
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}
{"foo": "bar"}

```



  
## Gzip壓縮



<script src="https://gist.github.com/artyomliou/2adfae7d2a66d227703c072803137501.js"></script>



  




  
## 逐行讀取gzip壓縮的文件



<script src="https://gist.github.com/artyomliou/d2bf17887737d2771ead371a34c3e28e.js"></script>
