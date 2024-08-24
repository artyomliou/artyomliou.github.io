---
layout: ../../../../layouts/PostLayout.astro
title: SSH到放在Private Subnet的EC2 Instance
slug: 2022/05/ssh到放在private-subnet的ec2-instance
date: 2022/5/27
category: system manager
tags: 
  - ec2
  - session-manager
  - system-manager
---

  
以前看到這種需求都覺得在不可思議，想不到真的可以







<br><br>



  
## 為什麼一開始我覺得很難達成？



  
如果要連上自己開的 EC2 Instance，需要達成以下條件：



  
- EC2 Instance 放在有 attach InternetGateway 的 subnet  
- EC2 Instance 有 public IP  
- Security group 有開放 inbound SSH  
- EC2 Instance 上有你使用的金鑰



<br><br>



  
雖然以前常常看到有些架構圖把 EC2 Instance 放在 private subnet 很不可思議，因為：



  
- EC2 Instance 要怎麼連出？（比如說 apt install）  
- 如果我沒有 public ip，要怎麼 SSH 進去管理系統？



<br><br>



  
## 可用的作法



  
1. System Manager – [Session Manager](https://docs.aws.amazon.com/zh_tw/systems-manager/latest/userguide/session-manager.html)  
2. [跳板機 Bastion host](https://aws.amazon.com/tw/quickstart/architecture/linux-bastion/)  
3. [Managed VPN](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/aws-managed-vpn.html)



  
第三個我沒用過所以不清楚<br>
不過我在考慮第一、第二種做法的時候，發現 Session Manager 有幾個明顯的優勢：



  
- Security group 完全不用開啟 inbound SSH（只需要能 [outbound 到幾個特定服務](https://docs.aws.amazon.com/zh_tw/systems-manager/latest/userguide/session-manager-prerequisites.html)）  
- [使用 IAM Policy 集中管理](https://docs.aws.amazon.com/zh_tw/systems-manager/latest/userguide/getting-started-restrict-access-quickstart.html)每位 IAM user 可以連到哪些主機  
- 執行指令的紀錄會儲存到S3，方便稽核
