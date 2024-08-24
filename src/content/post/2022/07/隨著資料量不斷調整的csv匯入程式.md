---
layout: ../../../../layouts/PostLayout.astro
title: 隨著資料量不斷調整的CSV匯入程式
slug: 2022/07/隨著資料量不斷調整的csv匯入程式
date: 2022/7/30
category: laravel
tags: 
  - csv
  - laravel
  - queue
  - sqs
---

  
最近常常用 PHP / Laravel 寫匯入資料的程式。為了效率起見，通常一開始就會使用 csv 格式，但這格式並不是萬能的，當資料量從 1 筆提升到 30000 筆，需要不斷調整程式才能妥善處理。



  
不過還是在開發之前就先抓好資料量是最好的啦🥲







  
假設我讓使用者透過 HTML Form 上傳一個 csv 檔案，而我會讀取其中的資料，並匯入資料庫。常見的手段應該是用 [UploadedFile](https://github.com/laravel/framework/blob/8.x/src/Illuminate/Http/UploadedFile.php) 搭配 [fgetcsv](https://www.php.net/manual/en/function.fgetcsv.php) 讀取資料，並用 [Eloquent ORM](https://laravel.com/docs/9.x/eloquent) 寫入。不過這樣子的標準手段很快就會因為資料量提高有所調整。假設寫入一筆資料要 0.1 秒，標準的 [PHP upstream timeout](https://www.php.net/manual/en/function.set-time-limit.php) 為 30 秒，意思是最多只能處理不到 300 筆資料…。



  
底下紀錄一下我在各個資料量曾遇到的問題：



  
  
 | 資料量 | 會遇到的問題 | 解決手段 |  
 | --- | --- | --- |   
 | ~ 300 | Eloquent可能不夠快 | 換成 [DB](https://laravel.com/docs/9.x/queries) |  
 |  | 記憶體可能不夠 | 使用 [SerializeModel trait](https://github.com/laravel/framework/blob/9.x/src/Illuminate/Queue/SerializesModels.php)、[Generator](https://www.php.net/manual/en/language.generators.syntax.php)、[調整php.ini](https://www.php.net/manual/en/ini.core.php#ini.memory-limit) |  
 |  | 寫入資料庫的速度不符合預期 | 參考[這篇文章](https://dba.stackexchange.com/questions/252445/how-does-autocommit-off-affects-bulk-inserts-performance-in-mysql-using-innodb)，一次 insert 寫多筆，或一次 transaction 寫多筆 |  
 |  | 再怎麼調整都無法在 timeout 前完成 | 使用 [Queue](https://laravel.com/docs/9.x/queues) |  
 | ~5000 | Queue 執行時出現不明原因的「Killed」 | 預先把使用者上傳的檔案從 [/tmp](https://www.fosslinux.com/41739/linux-tmp-directory-everything-you-need-to-know.htm) 搬到 [storage](https://laravel.com/docs/9.x/filesystem)，<br>
並且dispatch 多個 Job，每個任務只處理檔案中的一小段 |  
 | ~15000 | 可能無法在 timeout 前完成所有 dispatch | 將 dispatch 的邏輯也放進 Queue<br>
`Controller -> DispatchJob -> ImportJob` |  
 |  | 執行順利，但使用者無從得知目前進度 | 開一張 Table，讓每個 Job 把自己處理的進度 increment 到同一筆資料 |  
 |  | 使用 Laravel 官方解決方案 | 使用 [Job Batching](https://laravel.com/docs/9.x/queues#job-batching) |  
 | ~30000 | [updateOrInsert()](https://laravel.com/docs/9.x/queries#update-or-insert) 速度慢 | 在 table 加 index



  
由上面這張表可以知道匯入 CSV 要採的坑真的是挺多的，感謝好同事先踩過這些坑XD



  
我也反思了一下，以前我主要寫 CRUD 的時候，每次 Request 處理的資料量可能都不超過 10 筆，所以幾乎不會使用到 Queue。當時要處理大量匯入、匯出程式的同事時常說他遇到很多問題，我一向都是說把 Eloquent ORM 換 DB Query Builder 即可（因為當時我只有這種經驗），但他也做了，因此我就無法跟他有進一步的討論，直到現在自己也開始接觸這種需求，才知道坑真的很多。



<br><br>



  




<br><br>



  
話說回來，本篇文章的使用場景是匯入 CSV 中的大量資料，但有另一種場景是大量寄信。<br>
大量寄信的場景我會採取下面的措施：



  
- 使用 dispatch job，其中有一 array 記錄了所有 mail job 的 record id  
- 每個 mail job 都有一筆 record 紀錄狀態，這筆 record 會關聯到套資料所需的其他 table



  
對於 SQS 的用戶來說，需要特別注意 dispatch job 的 payload size 不能超過 [256 KB](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html)（因為 Laravel 會把 Job 序列化成文字，包含 job 內的資料，並送到 SQS）。
