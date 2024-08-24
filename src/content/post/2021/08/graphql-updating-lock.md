---
layout: ../../../../layouts/PostLayout.astro
title: 為頻繁執行的GraphQL API加上Update Lock
imgSrc: /wp-content/uploads/2021/08/Untitled-Diagram-150x150.jpg
slug: 2021/08/graphql-updating-lock
date: 2021/8/26
category: javascript
tags: 
  - cache
  - graphql
  - inmemory
  - lock
  - nodejs
---

  
我有一個 GraphQL Query，他做的事情很單純：根據ID去撈出對應紀錄的欄位


  
query {<br>

　getProjectStatus(id: ID!)<br>

}



  
因為這支 Query 會頻繁、大量的被拉取，所以需要做 Cache。



  
那麼 node 有 [node-cache](https://www.npmjs.com/package/node-cache) 這個套件可以做記憶體快取，而且它可以指定 ttl（時間一過自動清除cache），<br>
每次 request 進來除非無法從 cache 找到資料才讀取 DB



  
不過既然說了**頻繁、大量**，那麼如果在 cache 過期瞬間，有大量 request 進來，DB不就爆了嗎？<br>
看起來為此是務必要引入 lock 機制



  
然後單純 lock 是不夠的，<br>
如果大量 request 都排隊等著 acquire lock，他們就需要等很久才回應…<br>
那麼能不能達成像 nginx proxy cache lock + background update 高速且低負載的效果呢？



  
- ![](/wp-content/uploads/2021/08/Untitled-Diagram.jpg)



  
可以的，<br>
關於詳細的程式碼，我覺得可以參考 David Barral 寫的 [Synchronize cache updates in Node.js with a Mutex](https://medium.com/trabe/synchronize-cache-updates-in-node-js-with-a-mutex-d5b395457138)



  
也可以參考下面我小調整後的程式碼，調整部份是 L18-L22



<script src="https://gist.github.com/artyomliou/37eaf9c781db45c962e29050ec86abcf.js"></script>



  




  
題外話，<br>
雖然說心裡有想把這類 API 用 Restful API 改寫，<br>
搭配 Nginx proxy cache lock + background update



  
只是還要多開一台小 node server，~~有點懶阿～~~
