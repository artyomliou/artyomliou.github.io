---
layout: ../../../../layouts/PostLayout.astro
title: 一台 ALB 多個 domain
imgSrc: 
slug: 2022/03/一台-alb-多個-domain
---

  
太神啦！<br>
我一直覺得 ALB 根本是 managed nginx，<br>
今天看到 [New – Host-Based Routing Support for AWS Application Load Balancers](https://aws.amazon.com/tw/blogs/aws/new-host-based-routing-support-for-aws-application-load-balancers/)，<br>
他是在說你可以讓 ALB 根據你請求的 host 把流量導到不同機器（Target group）



  
所以搞不好一間公司只需要一台 ALB？<br>
不過如果設超過 10 個 rule 就要加💸



[](https://aws.amazon.com/tw/elasticloadbalancing/pricing/)



  

