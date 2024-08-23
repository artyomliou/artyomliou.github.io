---
layout: ../../../../layouts/PostLayout.astro
title: 用 Reachability Analyzer 測試 Lambda 能不能連上 VPC Endpoint
imgSrc: 
slug: 2022/01/用reachability-analyzer測試lambda-能不能連上-vpc-endpoint
---

  
當你在開發一個 Lambda function，它要在 VPC 裡面呼叫 AWS 服務，<br>
然後你發現……怎麼不會通？問題到底出在哪？<br>
這時用 Reachability Analyzer 先做第1階段的測試：網路到底有沒有通吧







  
Lambda 一旦放到 VPC 裏面，就無法存取 internet 了。<br>
而大部份 AWS 服務的 endpoint 都是在 internet 上，可以[透過 NAT Gateway 讓 Lambda 能對外連線](https://aws.amazon.com/tw/premiumsupport/knowledge-center/internet-access-lambda-function/)；<br>
或者用 [VPC Endpoint (Interface)](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html) 讓 Lambda 能存取指定 AWS 服務。



  
不過在開發階段，每次更新 VPC 中的 Lambda 都要等非常久，<br>
尤其在測試 Lambda 是否能正確透過 VPC endpoint 連上 AWS service 的時候，<br>
因為 VPC 相關的設定有非常多要調整，這樣來回測試就要花非常多的時間。



  
不過可以用 [Reachability Analyzer](https://aws.amazon.com/blogs/aws/new-vpc-insights-analyzes-reachability-and-visibility-in-vpcs/) 直接測試 Lambda 到 VPC Endpoint 的網路是不是通的：<br>
先到 EC2 console 的 Network Interfaces，看看 Lambda 用的 ENI 是哪幾張



[](https://blog-img.artyomliou.ninja/wp-content/uploads/2022/01/Screenshot-2022-01-03-at-15-10-53-Network-interfaces-EC2-Management-Console.png)



  
再到 VPC console 的 Reachability Analyzer 點「Create and analyze path」，<br>
並且輸入下列資訊



[](https://blog-img.artyomliou.ninja/wp-content/uploads/2022/01/Screenshot-2022-01-06-at-11-20-24-VPC-Management-Console.png)



  
接著送出之後，等一陣子他跑完之後 refresh 一次網頁，就會出現整個 flow



[](https://blog-img.artyomliou.ninja/wp-content/uploads/2022/01/Screenshot-2022-01-03-at-15-13-10-VPC-Management-Console.png)
