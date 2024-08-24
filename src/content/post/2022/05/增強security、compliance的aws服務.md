---
layout: ../../../../layouts/PostLayout.astro
title: 增強Security、Compliance的AWS服務
slug: 2022/05/增強security、compliance的aws服務
date: 2022/5/21
tags: 
  - audit
  - aws
  - compliance
---

  
最近在準備 [SysOps Associate](https://aws.amazon.com/tw/certification/certified-sysops-admin-associate/) 的考試，因此才接觸到很多這方面的服務<br>
要是早點知道就好了😂







  
  
 | 名稱 | 用途 | 划算嗎？ |  
 | --- | --- | --- |   
 | [Amazon Inspector](https://aws.amazon.com/tw/inspector/) | 掃描EC2、ECS上的網路漏洞、軟體漏洞、CVE | 是***1** |  
 | [AWS Config](https://aws.amazon.com/tw/config/) | 紀錄AWS resource的設定變更，並評估是否合規 | 是***2** |  
 | [AWS CloudTrail](https://aws.amazon.com/tw/cloudtrail/) | 紀錄此帳號下的API呼叫， 並儲存到 Cloudtrail Lake 或 S3 | 是 |  
 | [AWS Artifact](https://aws.amazon.com/tw/artifact/) | 檢查是否合規（ISO27001等等） |  |  
 | [AWS System Manager](https://aws.amazon.com/tw/systems-manager/) | 包含一堆子功能：Change manager、Session Manager、Patch Manager | 免費



  
註記：



  
1. 沒用過，但看起來是便宜的  
2. 沒用過，但它是根據使用量計價，也就是 AWS resource 設定的變更次數，通常不會太多次
