---
layout: ../../../../layouts/PostLayout.astro
title: EC2 不用密碼連線到 RDS (MySQL)
imgSrc: 
slug: 2022/03/ec2-不用密碼連線到-rds-mysql
---

  
我大致翻譯了[用 IAM 做驗證登入資料庫](https://aws.amazon.com/tw/premiumsupport/knowledge-center/users-connect-rds-iam/)這篇文章的步驟，另外用圖片說明 Policy 設定的要點。<br>
以及用圖片介紹從 Application、RDS Proxy、RDS Instance 之間用 IAM 連線的細節







  
底下摘錄了文章中與 IAM Authentication 有關的步驟



  
  
 | 步驟 | 操作位置 | 要做的事 |  
 | --- | --- | --- |   
 | 1 | RDS控制台 | 對 Instance 開啟 IAM authentication |  
 | 2 | MySQL client | 在 MySQL 裡面建立一個 user，搭配 AWSAuthenticationPlugin |  
 | 3 | IAM控制台 | 建立一個 IAM Role（其內容包括一個允許使用上述 db user 連線的 policy） |  
 | 4 | 您的程式 | 使用 AWS SDK 的 TokenGenerator，輸入 db hostname、db user，用產生出來的 token 當成 db password 連線到資料庫



![](/wp-content/uploads/2022/03/Untitled-1024x651.png)注意第二步、第三步的 username！



<br><br>



  
## 用 SSL 保護 DB 連線



  
 |  
 | 步驟 | 操作位置 | 要做的事 |  
 | --- | --- | --- |   
 | 1 | MySQL Client | 對 db user 要求強制使用 SSL 連線<br>
`ALTER USER {dbusername} REQUIRE SSL;` |  
 | 2 | Server | 下載 RDS 的 CA，並使用它來做 SSL 連線<br>
`wget https://s3.amazonaws.com/rds-downloads/rds-ca-2019-root.pem`



<br><br>



  
## 用 IAM 連線到 RDS Proxy



  
請參考[這篇文章](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/rds-proxy-setup.html#rds-proxy-connecting-iam)，或直接看下面的圖



[](https://blog-img.artyomliou.ninja/wp-content/uploads/2022/03/IAM_AUTH_RDS.drawio.png)
