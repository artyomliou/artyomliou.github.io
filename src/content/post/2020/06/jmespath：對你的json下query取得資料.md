---
layout: ../../../../layouts/PostLayout.astro
title: 有如JSON Selector的JMESPath
imgSrc: 
slug: 2020/06/jmespath：對你的json下query取得資料
---

  
前陣子在看[AWS文件](https://docs.aws.amazon.com/zh_tw/sdk-for-php/v3/developer-guide/guide_jmespath.html)的時候意外發現這個神奇的工具，它可以降低你從JSON中取出資料的程式碼的複雜度，同時降低了維護的成本。



  
要我說的話，它應該成為parse JSON的標配。具體來說，它是一種可以用來從JSON中取得指定結構的查詢語言，正如它官網自己所說的：



  
>   
JMESPath is a query language for JSON.



  
#### **案例-從ElasticSearch API取出結構化資料**



  
比如說ElasticSearch的Date Histogram Aggregation API會回傳一個JSON：



<script src="https://gist.github.com/artyomliou/06fc13b55d6c02c1249fe15bd9764c5b.js"></script>



  
我想使用下面的PHP程式碼



<script src="https://gist.github.com/artyomliou/08e24eb962f7a4906950f9e23fbc4135.js"></script>



  
把它轉成下列這個格式的陣列：



<script src="https://gist.github.com/artyomliou/4b6ccf9f4ec44810d479ca1cf52fbfc9.js"></script>



  
有經驗的人應該很清楚， 當遇到複雜的JSON、而且要取出更多資料的時候， 上面這段程式碼的複雜度會急速飆高，而且難以維護。



  
如果使用JMESPath， 你可以透過下列的語法得到一樣的結果：


  
aggregations.sales_over_time.buckets[*].{key: key_as_string, value: doc_count}



  
#### **在官網實驗JmesPath**



  
如果你有興趣，可以到[JMESPath官網](https://jmespath.org/)，貼上更複雜的JSON，自己動手玩。比如說把上面這案例貼上去……
