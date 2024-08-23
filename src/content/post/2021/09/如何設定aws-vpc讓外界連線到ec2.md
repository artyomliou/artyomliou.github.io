---
layout: ../../../../layouts/PostLayout.astro
title: 成功連到 EC2 上的服務
imgSrc: 
slug: 2021/09/如何設定aws-vpc讓外界連線到ec2
---

  
整理一下供日後參考







  
在[這篇文章](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)裡面的「 Enable internet access 」章節提到提到讓外界連到 EC2 ：




  
1. 為 VPN 建立並連結一個 **internet gateway**



  
2. 在 subnet 的 **route table** 增加一條「將前往 internet 的流量都導向 internet gateway」的規則



  
3. 確定你的 EC2 有 **globally unique IP address** (public IPv4 address, Elastic IP address, or IPv6 address).



  
4. 確定你的 **network access control list** 和 **security group** 允許流量進出你的 instance




  
 



  
其中第二點，指的是對 subnet 的 route table 增加一條 destination 0.0.0.0/0 到 target igw 的 規則（若沒特別設定，則 subnet 會自動與 Main route table 關聯）



  
 



  




  
也可以看這位大大的解說，比較容易理解：




<iframe title="AWS Networking Fundamentals" width="500" height="281" src="https://www.youtube.com/embed/hiKPPy584Mg?start=458&amp;feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>




  
另外上面的影片，那位仁兄也有提到 NACLs 跟 Security group 的差別，這些內容在[這篇文章](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html#VPC_Security_Comparison)也看的到
