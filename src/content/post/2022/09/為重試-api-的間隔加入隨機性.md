---
layout: ../../../../layouts/PostLayout.astro
title: 為重試 API 的間隔加入隨機性
slug: 2022/09/為重試-api-的間隔加入隨機性
date: 2022/9/24
category: rds
tags: 
  - exponential-backoff
  - imds
  - jitter
  - rds-proxy
---

  
公司的一個系統需要在兩台 EC2 之間傳輸資料，假設稱他們為 A 與 B，資料由 A 傳向 B，而這些傳輸偶爾會因資料庫連線時的身分驗證失敗。







<br><br>



  
B 機器[使用 IAM authentication 連線到 RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy-setup.html#rds-proxy-connecting-iam)。



  
為此，要先用 `Aws\Rds\AuthTokenGenerator` [產生 RDS token](https://github.com/aws/aws-sdk-php/blob/master/src/Rds/AuthTokenGenerator.php#L46-L72)，這個 Class 會透過 `Aws\Credentials\CredentialProvider` 的 `Aws\Credentials\InstanceProfileProvider`向 IMDS [取得 temporary security credentials](https://github.com/aws/aws-sdk-php/blob/master/src/Credentials/InstanceProfileProvider.php#L19)，並用來做 RDS Token 的簽章。



  
IMDS 會[對每一台 instance 做 throttling](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html#instancedata-throttling)，因此從這服務取得的 temporary security credentials 應該要儲存起來。不過併發請求會造成快取穿透，導致部分請求會因其無法向 IMDS 取得 credentials 而失敗。<br>
解法有兩種：



  
1. 在背景定期更新 credentials  
2. 參考 [AWS Architecture Blog – Exponential Backoff And Jitter](https://aws.amazon.com/tw/blogs/architecture/exponential-backoff-and-jitter/)。在取得 credentials 失敗後，用 exponential backoff 重試，並且加入 jitter



<br><br>



  
關於第二種解法：<br>
併發請求不適合只用 Exponential backoff 決定重試間隔。因為併發請求會同時失敗，並在相同的秒數後重試。所以有必要為其重試間隔再加入一段隨機長度的時間，也就是 jitter。



  
Jitter 可以有效地下次重試的時間點錯開
