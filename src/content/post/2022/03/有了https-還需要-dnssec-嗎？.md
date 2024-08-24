---
layout: ../../../../layouts/PostLayout.astro
title: 有了HTTPS 還需要 DNSSEC 嗎？
slug: 2022/03/有了https-還需要-dnssec-嗎？
date: 2022/3/9
category: http
tags: 
  - ca
  - dns
  - dnssec
  - https
  - tls
---

  
最近跟資安專家開會討論新專案，他們提問：「你要怎麼確定 User 連上的真的是你的網站？」<br>
同事則問「有 HTTPS 不就夠了嗎？」<br>
他們兩個問的都是好問題 😂<br>
深入挖掘之後我認為 HTTPS 只是基本，還需要搭配 DNSSEC







  
>   
這篇文章是我個人的研究、推測，並不保證正確性。



  
## DNS 有什麼問題？



  
在 [iThome 的這篇報導](https://www.ithome.com.tw/tech/87819)裏面提到 DNS 通常使用 UDP 溝通，但 UDP 是不安全的，因此容易被攻擊。



  
而 [Cloudflare 這篇文章](https://blog.cloudflare.com/dnssec-an-introduction/#kaminskysattack)介紹了真實的攻擊案例。



  




  
## HTTPS 有什麼問題？



  
根據 wikipedia 對 HTTPS 的描述：



![](/wp-content/uploads/2022/03/Screenshot-2022-03-09-at-11-36-28-超級文字傳輸安全協定-維基百科，自由的百科全書.png)



  
也就是說 HTTPS 依靠憑證練確保：使用者正在跟正確的 server 連線。



  
假設 CA 不會出問題，使用者不會安裝來路不明的根憑證到電腦上，<br>
而且憑證鍊上的每一張憑證都沒有問題，<br>
那應該連線就是絕對安全的？



  
#### 濫發憑證



  
但是 CA 有可能誤發（或者濫發）憑證，比如[賽門鐵克的案例](https://www.ithome.com.tw/news/112989)。<br>
也就是說，在滿足下列的條件時，使用者可能完全不會發覺自己已經連上駭客假冒的網站：



  
1. 有 CA 正在濫發憑證  
2. DNS 汙染



![](/wp-content/uploads/2022/03/case-2-without-dnssec.png)



  
#### 仿冒網站 + 被濫發的憑證 + DNS汙染 = 使用者不會發現連到駭客架設的網站



  
駭客需要做的事情是，向該 CA 申請了一張受害網站的憑證，<br>
然後汙染 DNS，讓 DNS 查詢指向駭客架設的假網站<br>
則使用者進入該網站時，會透過被汙染的 DNS 拿到假網站的 IP，並從假網站拿到一張被濫發的憑證，<br>
然後成功建立 HTTPS 連線。



  




  




  




  
## 可能的解法？



  
#### CA 濫發憑證的解法



  
- [設定 DNS CAA](https://ezbox.idv.tw/112/dns-caa-protec-ssl-tls-certificate/) – 確保只有特定 CA 能為我的網站簽發憑證  
- [設定 DNSSEC](https://www.cloudflare.com/zh-tw/dns/dnssec/how-dnssec-works/) – 確保 DNS 查詢的結果不受竄改  
- [Certificate Transparency](https://certificate.transparency.dev/) + [Expect-CT header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT)



  
#### 進一步確保使用者只跟正確的 Server 做 HTTPS 連線



  
- [設定 HSTS preload](https://hstspreload.org/)（[參考](https://https.cio.gov/guide/#compliance-and-best-practice-checklist)）  
- [設定 Strict-Transport-Security header](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Headers/Strict-Transport-Security)



  




  




  




  
## 詳細解釋這些解法



  
#### DNSCAA



  
這是在自己的 DNS zone 上加入 CAA record。<br>
但因為 DNS 查詢有被汙染的可能，還是需要加上 DNSSEC 保護。



  




  
#### DNSSEC



  
透過類似 HTTPS 憑證鍊的方式確保 DNS 紀錄不受竄改，<br>
而且 DNS 本身就有層級關係，不像 HTTPS 的設計：每一家 CA 都有能力為每個網站簽發憑證，<br>
所以 DNSSEC 不像 HTTPS 需要額外的監管機制（CT等等）。 



  




![](/wp-content/uploads/2022/03/Screenshot-2022-03-09-at-12-33-33-DNSSEC-如何運作.png)當使用者在 parent zone 查找我們網域的 DS record 時便能知道是否啟用 DNSSEC



  
佈署時如果發生問題，可以看看 [Cloudflare 的分享](https://support.cloudflare.com/hc/en-us/articles/360021111972-Troubleshooting-DNSSEC)<br>
成功佈署之後，用 dnsviz 應該會看到類似的結果：



![](/wp-content/uploads/2022/03/blog.artyomliou.ninja-2022-03-09-04-36-50-UTC-347x1024.png)



  




  
#### Certificate Transparency



  
在申請憑證時，CA 會主動把憑證提交到 CT logs，並且在憑證中加入 SCT 紀錄。<br>
但還需要瀏覽器主動檢查 CT logs，根據 [MDN 的說明](https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency)：firefox 並不會主動檢查 CT logs，<br>
所以我們還需要額外設定 Expect-CT header



  
可以透過 [https://crt.sh/](https://crt.sh/) 察看 CT logs
