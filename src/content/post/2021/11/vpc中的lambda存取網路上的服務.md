---
layout: ../../../../layouts/PostLayout.astro
title: VPC中的Lambda存取網路上的服務
slug: 2021/11/vpc中的lambda存取網路上的服務
date: 2021/11/23
category: lambda
tags: 
  - aws
  - lambda
  - nat-gateway
  - vpc
  - vpc-endpoint
---

  
今天確定了這個事情：



  
當 Lambda 放在 VPC 裡面，就無法直接存取網路上的服務。<br>
如果要能存取，可以設定 NAT Gateway 或 NAT instance；<br>
而如果你要存取的只有 AWS 的服務，可以只開 VPC endpoint。



  
可以參考 [如何為連接到 Amazon VPC 的 Lambda 函數提供網際網路存取權限？](https://aws.amazon.com/tw/premiumsupport/knowledge-center/internet-access-lambda-function/)



  




  
murmur



  
雖然用 Lambda 處理 scaling 很方便也很 cost-efficient，<br>
但當要存取這麼多透過 internet 連線的服務時，<br>
就要把建立 NAT Gateway 或 VPC endpoint 的價錢考慮進去。



  
當然，如果不考慮錢的話當然是開爆XD<br>
因為同樣是處理 scaling，用ALB + EC2 + Auto scaling group 真的就是比較麻煩阿
