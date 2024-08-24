---
layout: ../../../../layouts/PostLayout.astro
title: MySQL「ci」字集做字串比對會無視大小寫
slug: 2022/08/mysql「ci」字集做字串比對會無視大小寫
date: 2022/8/14
category: mysql
tags: 
  - charset
  - mysql
---

  
在我踩到坑、並找到解法之後，才發現這個很基礎<br>
但踩到了就踩到了，還是紀錄一下🙈



  
根據 [khiav223577 大大的「MySQL 編碼挑選與差異比較」](https://khiav223577.github.io/blog/2019/06/30/MySQL-%E7%B7%A8%E7%A2%BC%E6%8C%91%E9%81%B8%E8%88%87%E5%B7%AE%E7%95%B0%E6%AF%94%E8%BC%83/)分享，<br>
一般常使用的「ci」字集，其意思是 case-insensitive，也就是大小寫不敏感。<br>
這種設定相當適合用在文章網站、新聞網站的搜尋功能，因為無論使用者輸入大寫的「APPLE」或小寫的「apple」，都能找到所有帶有「Apple」關鍵字的資料。<br>
但當你需要做如 ID 比對、token 比對、短網址代碼比對，可能都需要改成 case-sensitive 字集，<br>
或者[在 WHERE 條件中使用 binary](https://stackoverflow.com/a/5629121) 達成目的。 







<br><br>



  
## 舉例



  
比如我要做一個短網址服務，我會為每個連結產生 8 個字元的 slug，使用 0-9 a-z A-Z，總共 62 種字，總共是 62<sup>8</sup>（218,340,105,584,896） 種組合



  
不過下列幾筆資料使用了類似、僅有大小寫不一樣的 slug：



  
1. UurxM6ey  
2. UurxM6Ey  
3. UurxM6eY



  
當使用 ci 字集做查詢第三筆的時候（`SELECT * FROM `short_codes` WHERE `code` = 'UurxM6eY' ORDER BY id ASC LIMIT 1;`），會因為 case-insensitive，所以找到第一筆資料，抓出跟預期不一樣的資料。



<br><br>



  
## 解法



  
**在不修改 ci 字集的條件下**要解決這問題，可以把查詢改成：



  
```
SELECT * FROM `short_codes` WHERE BINARY `code` = 'UurxM6eY' ORDER BY id ASC LIMIT 
```



<br><br>



  
## 影響



  
若是不解決這問題，這短網址服務的 slug 組合會剩下 (26/2 + 26/2 + 10)<sup>8</sup> = 2,821,109,907,456 種組合<br>
並且會給部分使用同字、不同大小寫的 slug 的使用者帶來困擾
