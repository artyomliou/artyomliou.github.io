---
layout: ../../../../layouts/PostLayout.astro
title: 計算 CloudFront Origin Shield 的費用
imgSrc: /wp-content/uploads/2022/12/cloudfront-origin-shield-requests.jpg
slug: 2022/12/計算-cloudfront-origin-shield-的費用
date: 2022/12/11
category: cloudfront
tags: 
  - aws
  - cloudfront
  - hls
  - m3u8
  - origin-shield
---

  
CloudFront 是 CDN 服務，其提供的 Origin Shield 的功能就是降低（CDN 後方） origin server 的壓力。



![](/images/AmazonCloudFront/latest/DeveloperGuide/images/origin-shield-with.png)From https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html



  
CloudFront 在[定價頁面](https://aws.amazon.com/cloudfront/pricing/#Feature_Pricing)中，關於 Origin Shield 的定價說的有點模糊，不過在[文件](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html#origin-shield-costs)裡有解釋。簡單來說，是`Cache miss requests * Origin Shield charge per 10,000 requests / 10,000`。<br>
上述公式的主要變數在**前者**。而**後者**的費率在不同區域是固定的，比如把 Origin Shield 放在 Tokyo 就是 $0.0090。







<br><br>



  
不過前者的情況分為兩種，其中第一點很好理解：




  
1. Non-cacheable requests: requests use the following HTTP methods: `PUT`, `POST`, `PATCH`, and `DELETE`.



  
2. Cacheable requests




  
而第二點的情況會比較複雜，讓我們考慮一下下面的計價公式：



  
`Total number of cacheable requests x (1 – cache hit rate) x percentage of requests that go to Origin Shield from a regional edge cache in a different region x Origin Shield charge per 10,000 requests / 10,000`



  
其中，`(1 - cache hit rate)`，等同 cache miss rate，所以 cache miss rate 越高、則費用也越高。



  
至於 `percentage of requests that go to Origin Shield from a regional edge cache in a different region` 則是在說：因為 Origin Shield 只能設在一個區域，那麼，當觀眾從其他區域讀取影片，且該區域目前沒有快取，則必須連線到位於別區域的 Origin Shield 抓資料。



![](/wp-content/uploads/2022/12/cloudfront-origin-shield-cacheable-request-cost-explain.jpg)Should be like this



<br><br>



  
## 用 HLS 串流推算 Origin Shield 費用



  
用 HLS 串流舉例，HLS 串流以一個不斷更新的 .m3u8 以及大量不會變動的 .ts 檔案組成。



  
.ts 檔案非常適合快取，而且快取時間只要設的夠長（比如 2 小時），也許直到直播結束，資料都還快取在 edge location。**因此 .ts 檔案應該不會造成大量 Origin Shield 的費用**。



  
.m3u8 檔案的快取時間就必須非常短（應該只有幾秒），其內容會不斷從 MediaPackage 抓到 Origin Shield 再抓到 CDN 放著。然而，在快取失效後、下次快取住之間應該存在空隙，在此空隙之間對 CDN 的請求應該都會造成 Origin Shield 的壓力，而**這些請求可能產生較高的費用**。



![](/wp-content/uploads/2022/12/cloudfront-origin-shield-requests.jpg)my theory



  
假設：




  
- 觀眾每 10 秒抓一次 m3u8



  
- 所有觀眾抓檔案的時間平均分布



  
- 有五千位觀眾



  
- 重新快取耗時 50 ms




  
則在「重新快取的 50 ms」跑去 CDN 抓檔案的請求有 25 次（`5000users / (10sec x 1000) x 50ms`），所以 `cache miss rate = 25 / 5000 x 100% = 0.5%`。<br>
這邊在做個殘忍的設定，就是雖然 Origin Shield region 設為 tokyo，但所有觀眾都是從 Hong Kong region 抓資料，並且直播時間為一小時，那麼 `total requests of cacheable requests = (60 x 60) / 10 x 5000 = 1800000`。



  
因此 .m3u8 造成的 Origin Shield 費用應該是 1800000<sub>REQ</sub> x 0.5% x 100% x 0.0095<sub>USD</sub> / 10000 = 0.00855 USD。



  
**結果還蠻便宜的XD**<br>
那值不值得就是看直播本身的商業價值了
