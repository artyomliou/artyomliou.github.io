---
layout: ../../../../layouts/PostLayout.astro
title: PHP 把 Public Key (.pem) 轉成JWK
slug: 2021/10/php把public-key-pem轉成jwk
date: 2021/10/20
category: php
tags: 
  - jwk
  - jwt
  - openssl
  - php
---

  
一般 public key 裡面的內容長的像這樣：



  
```
-----BEGIN PUBLIC KEY-----
MII...
-----END PUBLIC KEY-----
```



  
當我們要用 JWK 公開 public key 的時候會發現：**JWK 裡面放的是 Public key 的 modulus、exponent**







  
所以必須要用下面的程式碼把 public key 的 modulus、exponent 抓出來<br>
然後 exponent 的「/」換成「_」；「+」換成「-」，並且把「=」移除



<script src="https://gist.github.com/artyomliou/1f71ea33c94d7adc7f4227336c7cb548.js"></script>



  
這樣就會產生出如同 [JWK Creator](https://russelldavies.github.io/jwk-creator/) 製造出來的 JWK



  




  
##### 參考資料



  
- [openssl_pkey_get_public](https://www.php.net/manual/en/function.openssl-pkey-get-public.php)  
- [openssl_pkey_get_details](https://www.php.net/manual/en/function.openssl-pkey-get-details.php)
