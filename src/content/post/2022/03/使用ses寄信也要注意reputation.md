---
layout: ../../../../layouts/PostLayout.astro
title: 使用SES寄信也要注意Reputation
imgSrc: /wp-content/uploads/2022/03/SES新加上的保護措施1.drawio2-150x150.png
slug: 2022/03/使用ses寄信也要注意reputation
---

  
你各位阿！聽過退信嗎？<br>
寄信後被退信到一定程度，AWS 會暫時不幫你寄信的RRR！！！







  
開始工作之後，逐漸從原本的收信人轉變為寄信人，<br>
用 SES 寄了很多信，也因此吃了很多退信（bounce），還有收信人回報他收到的是垃圾郵件（complaint），<br>
這些都會降低我的 reputation，如果不處理就是等著被 SES 停權。



  
退信分成兩種（[參考](https://docs.aws.amazon.com/ses/latest/dg/notification-contents.html#bounce-types)）：



  
- Hard bounce：這個 email 已經永久失效，不應該再寄信給它  
- Soft bounce：因為各種原因，這個 email 暫時無法接受這封信



  
Complaint 的話就代表收信人已經很不爽了，通常最好是不要再寄信給他XD<br>
（_除非你要寄重要的 transaction mail 給他，可以另外建一套 configuration set，並覆寫 suppression list 設定_）



![](/wp-content/uploads/2022/03/SES新加上的保護措施1.drawio2-1024x481.png)



  
Measure 1 就是用 Lambda 來接受 SES 的 bounce、complaint 通知，並把[通知](https://docs.aws.amazon.com/zh_tw/ses/latest/dg/event-publishing-retrieving-sns-examples.html)中的 email 寫進 account-level suppression list，<br>
往後只要使用 SES 寄信就會套用這份 list 做過濾。



  
Measure 2 則是用 Cloudwatch 監控退信率、抱怨率有沒有異常飆高…。
