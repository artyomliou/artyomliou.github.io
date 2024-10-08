---
layout: ../../../../layouts/PostLayout.astro
title: 用 AWS EC2 架 WordPress 的年花費
slug: 2021/08/用aws架wordpress的花費
date: 2021/8/24
category: aws
tags: 
  - cloudfront
  - cost
  - ebs
  - ec2
  - route-53
  - s3
---

  
我在 AWS 上架 WordPress，目標就是能用、運作順暢的小網站



  
有額外買Domain、用AWS S3當圖床<br>
伺服器位置在東京



  
以下是預估花費







  

    
          

             | 服務
             | 細項
             | 費率
             | 計算
             | 備註
        
    
    
         |  

             | EC2
             | t3a.micro
             | 0.0122/小時
             | 
             | 資料庫也裝在這
        
         |  
 | --- | --- | --- | --- |   

             | EC2 Instance Savings Plans<br>
(3年、無預付)
             | 0.0053/小時<br>
(承諾用量=0.005/小時)
             | (0.005 + (0.0053-0.005/0.0053) * 0.0122)美元 * 24小時 * 365天 ≒ 49.85 USD
             | 有買這個EC2才會便宜
        
         |  

             | EBS (gp3、8 GB)
             | 0.096/GB-月
             | 0.096 * 8GB * 12月 = 9.216
             | SSD
        
         |  

             | EBS Snapshot (2份)
             | 0.05 /GB-月
             | 0.05 * 約5GB * 12月 ≒ 3
             | SSD備份
        
         |  

             | Route 53
             | Domain 續約費用 (.ninja)
             | 
             | 18
             | 網域
        
         |  

             | Hosted zone
             | 0.5
             | 0.5
             | 網域代管費
        
         |  

             | S3
             | 
                假設：<br>

                儲存 1000張 200KB 的圖片 (0.2GB)<br>

                每月有 1000 次圖片讀取
            
             | 
                
                    儲存
                    0.025/GB-月
                    讀取
                    0.00000037/請求
                
            
             | 
                
                    儲存
                    0.2GB * 0.025 * 12月 = 0.06
                    讀取 + HTTPS請求
                    (1000次 * (0.00000037 + 0.0000012)美元 * 12月 = 0.01884
                    傳出
                    (1000次 * (200/1024/1024)GB ) * 12月 ≒ 2.29
                
            
             | 圖床
        
         |  

             | Cloudfront
             | 
                
                    傳出
                    0.120/GB
                    HTTPS請求
                    0.0000012/請求
                
            
             | CDN
        
    
    
         |  

             | 
             | 82.93 USD ≒ 2322 TWD
             | 
        
    

