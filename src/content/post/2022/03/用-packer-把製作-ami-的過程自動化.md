---
layout: ../../../../layouts/PostLayout.astro
title: 用 Packer 把製作 AMI 的過程自動化
slug: 2022/03/用-packer-把製作-ami-的過程自動化
date: 2022/3/27
category: terraform
tags: 
  - ami
  - ec2
  - hashicorp
  - packer
---

  
使用 Ubuntu 20.04 LTS 這種版本的好處是，當有新的資安漏洞揭露、修補完成後，<br>
Ubuntu 官方會釋出[資訊](https://ubuntu.com/security/notices)，應該也會更新 AWS 上的 AMI<br>
這種時候就用事先寫好的 Packer 設定檔，還有新版 AMI，花個十分鐘讓他自動做新的 golden image<br>
這樣可以讓每一台新開的 server 都使用最新的軟體，藉此增加安全性







<br><br>



  
## Packer 好用的地方



  
它最 Amazing 的地方是：他會自己在 default VPC 下建立他要用的 security group、instance<br>
接著把指定的檔案複製到 instance 之後，開始全自動的建立 AMI



  
建立完之後，上述資源他都會自己關掉



<br><br>



  
## 採用步驟



  
1. 先去開一台 Instance，跑一次安裝套件的流程，並把指令寫成 shell script  
2. [安裝 Packer](https://www.packer.io/downloads)  
3. 先跟著這篇 [Provision Infrastructure with Packer](https://learn.hashicorp.com/tutorials/terraform/packer) 學怎麼使用 Packer  
4. 把 step 1 寫好的 shell sciprt 複製到 step 3 拉下來的專案中，並根據需要調整 [images/image.pkr.hcl](https://github.com/hashicorp/learn-terraform-provisioning/blob/packer/images/image.pkr.hcl)  
5. 用 Packer 與自己寫的 shell script 製作自己的 AMI  
6. 取得 AMI id  
7. （如果你有用 Terraform 佈署 EC2 instance）把 AMI id 填進 [aws_instance](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance#ami)



<br><br>



  
## 題外話



  
如果有用 Terraform 的 [data source: aws_ami](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami) 來指定 [aws_instance ami](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance#ami) 的人，<br>
應該會發現偶爾 data source: aws_ami 拿到的 ID 會改變，造成 instance 被重開 XD



  
我猜這應該是 Ubuntu 有因為各種原因[釋出](https://ubuntu.com/security/notices)新版 AMI 的關係…
