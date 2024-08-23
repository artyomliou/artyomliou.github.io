---
layout: ../../../../layouts/PostLayout.astro
title: 用Nginx做微快取
imgSrc: 
slug: 2021/02/用nginx替nuxt、apollo-server加上微快取並提高效能
---

  
用 nginx 設定一個極短的 cache ttl，搭配 `proxy_cache_use_stale`、`proxy_cache_background_update`，不僅可以大幅度提高網站反應速度、負載能力，還能大幅度降低 upstream 的 CPU使用率<br>
但還是要看場景。







  
## 起因



  
最近工作上遇到一個架構上很單純的網站，它透過 nuxt 產出動態網站，它會打 API 拉資料並做套版除此之外沒有登入需求、沒有驗證需求，很單純



![](/wp-content/uploads/2021/08/1-1024x206.png)



<br><br>



  
#### **效能瓶頸**



  
眾所皆知，nginx 的效能非常好，但在這個架構中，nginx 的效能受限於位於 upstream 的 Nuxt。簡單說，**整個網站的效能 = Nuxt的效能**



  
在[nginx 官方部落格](https://www.nginx.com/blog/benefits-of-microcaching-nginx/)中有一張很棒的圖，可以用來說明，一般來說哪些內容可以透過 cache 提高效能



![](/wp-content/uploads/2015/12/cacheability-range-static-dynamic-personalized.png)



  
而我們的 Nuxt 網站雖然是動態的，但沒有登入需求，所以 Nuxt 的 response 沒有 user data。



  
>   
It’s dynamic content, but cacheable.



<br><br>



  
## **實作Cache**



  
底下內容都參考自[nginx 官方部落格](https://www.nginx.com/blog/benefits-of-microcaching-nginx/)



  
同時程式碼放在[Github](https://github.com/artyomliou/benchmarking-nginx-stale-cache-nuxt-gql)



  
#### 現狀



  
再複習一次現在的架構圖，圖中線的粗度代表流量




![](/wp-content/uploads/2021/08/1-1024x206.png)




  
因為每次 request，nginx 都必須把 request 交給 upstream 處理，所以當流量一大，Nuxt、GraphQL就會吃掉不少CPU，最終的效能如下，一秒鐘可以負擔 536 筆 request



  
```
Requests per second:    536.09 [#/sec] (mean)
Time per request:       18.653 [ms] (mean)
Time per request:       1.865 [ms] (mean, across all concurrent requests)
Transfer rate:          1853.29 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:    10   19   5.9     18     213
Waiting:       10   19   5.9     18     213
Total:         10   19   5.9     18     213
```



<br><br>



  
#### **加上微快取**



  
現在在 nginx 在 proxy_pass 後面加上這幾句，來啟用快取


  
proxy_cache my_cache;<br>

proxy_cache_valid 200 1s;



  
如同下面這張圖：




![](/wp-content/uploads/2021/08/2-1024x206.png)




  
效能就提高非常多，來到49885





  
```
Requests per second:    49885.86 [#/sec] (mean)
Time per request:       0.200 [ms] (mean)
Time per request:       0.020 [ms] (mean, across all concurrent requests)
Transfer rate:          172505.70 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:     0    0   1.1      0      82
Waiting:        0    0   1.1      0      82
Total:          0    0   1.1      0      82
```





<br><br>



  
#### **快取穿透**



  
不過這邊有個潛在的問題，是在 nginx 官方部落格有提到的，就是快取穿透問題




![](/wp-content/uploads/2021/08/official_ref_1-1.png)




  
每 1 秒 nginx 認定快取過期之後，所有使用者的 request 都會被轉發到 upstream，直到 upstream 再次回傳網頁讓 nginx 快取起來，因此會造成雖然效能已經很好，但CPU佔用率仍然很高的問題



<br><br>



  
#### **優化微快取**



  
官方提供的優化方法是加上下列兩行


  
proxy_cache_lock on;<br>

proxy_cache_use_stale updating;



  
- proxy_cache_lock 可以限制在快取過期時，nginx 只向後轉發一個 request  
- proxy_cache_use_stale 可以在快取過期時，直接回傳**目前版本**



  
這樣子的話，就算有大量使用者同時瀏覽已經快取過期的網頁，也只有第一筆連線會需要等到 request finished，其他連線則是直接回傳****目前版本****。



  
等到 upstream 完成第1筆連線，重新快取之後，下次所有人連線就可以拿到新版本了。這樣一來，upstream 的壓力肯定低不少。



  
就像下面這樣




![](/wp-content/uploads/2021/08/3.png)

