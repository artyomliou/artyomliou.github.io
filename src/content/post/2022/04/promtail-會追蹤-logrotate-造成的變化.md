---
layout: ../../../../layouts/PostLayout.astro
title: Promtail 會追蹤 logrotate 造成的變化
imgSrc: 
slug: 2022/04/promtail-會追蹤-logrotate-造成的變化
---

  
Promtail 可以追蹤 log file 的變化，定期把新增的部分上傳到 loki，並[把目前行數紀錄在 positions.yml](https://grafana.com/docs/loki/latest/clients/promtail/configuration/#example-static-config)<br>
而 logrotate 可以把過大的 log file 轉存到 log.*.gz，並[把目前的 log file 清空](https://linux.vbird.org/linux_basic/centos7/0570syslog.php#rotate)



  
問題來了，Promtail 是否會在 logrotate 執行時更新 positions.yml 裡面此檔案的行數呢？<br>
會







  
在已開啟 Promtail 時，手動執行 `logrotate -vf`，會得到下面的訊息：



  
```
level=info ts=2022-04-28T10:25:25.862815306Z caller=filetargetmanager.go:177 msg="received file watcher event" name=/home/pikachu/laravel/storage/logs/laravel.log.1 op=CREATE
level=info ts=2022-04-28T10:25:25.862890722Z caller=filetargetmanager.go:177 msg="received file watcher event" name=/home/pikachu/laravel/storage/logs/laravel.log op=CREATE
level=info ts=2022-04-28T10:25:25.862918666Z caller=filetargetmanager.go:177 msg="received file watcher event" name=/home/pikachu/laravel/storage/logs/laravel.log.1.gz op=CREATE
ts=2022-04-28T10:25:25.949073987Z caller=log.go:168 level=info msg="Re-opening moved/deleted file /home/pikachu/laravel/storage/logs/laravel.log ..."
ts=2022-04-28T10:25:25.949427639Z caller=log.go:168 level=info msg="Successfully reopened /home/pikachu/laravel/storage/logs/laravel.log"
```



  
此時再進去 positions.yml 會發現此檔案的最後行數已經歸零



<br><br>



  
既然如此，以後就不太會用到 laravel logging 的 daily 了
