---
layout: ../../../../layouts/PostLayout.astro
title: 挑選適合 Ubuntu 的筆電及安裝
imgSrc: 
slug: 2022/06/挑選適合ubuntu的筆電及安裝
---

  
最近在物色一台安裝Ubuntu後不太會出現相容性問題的筆電<br>
挑出中意的型號後，可以先到這些網站查查相容性：



  
1. 到 [Ubuntu Certified Laptop](https://ubuntu.com/certified/laptops) 是否已經有該型號  
2. 到 [Linux Hardware](https://linux-hardware.org/) 查該型號是否有網友已用 [hw-probe](https://linux-hardware.org/?view=howto) 工具回報相容性  
3. 到 Youtube 找有沒有人拍過該型號😂







<br><br>



  
## 事前調查



  
有鑑於入門筆電大部份沒做有線網路孔（RJ45），<br>
請事先確認該型號的 WIFI 網卡型號，是否能在其他筆電，被 linux 正常驅動<br>
以我最後買的 [Dell Inspiron 14 5425](https://www.dell.com/zh-tw/shop/dell-%E7%AD%86%E8%A8%98%E5%9E%8B%E9%9B%BB%E8%85%A6%E8%88%87%E5%B0%8F%E7%AD%86%E9%9B%BB/inspiron-14-%E7%AD%86%E8%A8%98%E5%9E%8B%E9%9B%BB%E8%85%A6/spd/inspiron-14-5425-laptop/ins%2014-5425-d1508stw) 來說，[官方規格](https://blog-img.artyomliou.ninja/wp-content/uploads/2022/06/Screenshot-2022-06-24-at-20-41-03-Dell-Inspiron-14-5000-5425-%E7%AD%86%E8%A8%98%E5%9E%8B%E9%9B%BB%E8%85%A6-Dell-%E5%8F%B0%E7%81%A3.png)說它用 MT7921<br>
在 Google 可以搜尋到 Linux Hardware [關於 MT7921 的相容性報告](https://linux-hardware.org/?id=pci:14c3-7961-1a3b-4680)<br>
在裡面提到 linux kernel 5.12 之後就有它的驅動，並且在 Ubuntu 22.04 上普遍是「Works」<br>
那我就安心惹



  
買進來之後跑 hw-probe 的結果：[https://linux-hardware.org/?probe=16e98704b5](https://linux-hardware.org/?probe=16e98704b5)



<br><br>



  
## 我的需求



  
分享一下我的規格要求



  
  
 | 需求 | 實際規格 |  
 | 大小適中 | 約 14 吋 |  
 | --- | --- |   
 | 效能夠 | CPU：AMD 5000 系列（Zen3）<br>
RAM：16G 雙通道<br>
WIFI：6<br>
SSD：512 GB |  
 | 續航好 | CPU：U系列<br>
GPU：不需要<br>
電池：50瓦時以上 |  
 | 外觀好看 | HP Pavilion<br>
Dell Inspiron<br>
Lenovo Slim 5 Pro



  
可以參考：[https://www.youtube.com/watch?v=_aELhI5Pihs](https://www.youtube.com/watch?v=_aELhI5Pihs)<br>
以及：[https://www.youtube.com/watch?v=jKJ12lo8P1o](https://www.youtube.com/watch?v=jKJ12lo8P1o)



<br><br>



  
## 安裝指南



  
整台電腦只裝 Ubuntu 請參考官方教學：[Install Ubuntu desktop](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview)<br>
要裝雙系統請參考：[How to install Ubuntu 20.04 and dual boot alongside Windows 10](https://medium.com/linuxforeveryone/how-to-install-ubuntu-20-04-and-dual-boot-alongside-windows-10-323a85271a73)



<br><br>



  
## 闔上筆電再打開後，系統停止回應



  
安裝 Ubuntu 時，我把 SWAP 設為 4 GB<br>
安裝完後第一次闔上筆電再開，馬上就**整台電腦停止回應**<br>
等了一兩分鐘都沒有回魂，只能重開



  
>   
我把這篇文章分享到 Telegram 的 Ubuntu tw 社群後，群友指出：<br>
我遇到的是 suspend 的問題，但這解法是針對 hibernate<br>
所以 root cause 還沒被找到



  
我用了下列的關鍵字搜尋：



  
- ubuntu  
- suspend  
- freeze / hang



  
我找到這篇看似相對可靠的解法：[Ubuntu 20.04 freezing after suspend solution](https://onestepcode.com/ubuntu-suspend-freeze-solution/)<br>
這篇文章的作者也找過很多（我也看過）的解法，而對他來說都沒有效<br>
我根據它的建議調整 SWAP size 到 `ram_size + sqrt(ram_size) = 20 GB` 之後，重新打開筆電時花了 30 秒回魂，算是有成功吧



  
#### 調整闔上筆電時的行為



  
承上，因為我無法接受「打開筆電要等 30 秒讓它回魂」<br>
所以我最後還是調整了 lid close behavior<br>
參考[這篇文章](https://ubuntuhandbook.org/index.php/2020/05/lid-close-behavior-ubuntu-20-04/)，把 `/etc/systemd/logind.conf` 中的 `HandleLidSwitch` 設成 `lock`<br>
這樣關上筆電時只會鎖定使用者



<br><br>



  
## 調整SWAP Partition後開機很慢



  
呈上<br>
我把原先的 SWAP partition 刪除、縮小 root partition、重新建立 SWAP partition<br>
接著雖然能順利開機進桌面，只是要花很久（2分鐘）<br>
可以參考：[Very slow boot with Ubuntu 15.04](https://askubuntu.com/questions/639559/very-slow-boot-with-ubuntu-15-04)<br>
更新 `/etc/fstab` 裡面紀錄著的 SWAP partition UUID



<br><br>



  
## 參考



  
- [How To: (More or Less) Learn if Your Hardware Will Work With Linux](https://linux-tips.us/how-to-more-or-less-learn-if-your-hardware-will-work-with-linux/)  
- [Random freezes on 20.04 with Dell XPS 9310](https://askubuntu.com/questions/1311478/random-freezes-on-20-04-with-dell-xps-9310)  
- [OEMKernel](https://wiki.ubuntu.com/Kernel/OEMKernel)  
- [What is the difference between Hibernate and Suspend](https://askubuntu.com/questions/3369/what-is-the-difference-between-hibernate-and-suspend)  
- [How to Change Lid Close Behavior in Ubuntu 20.04](https://ubuntuhandbook.org/index.php/2020/05/lid-close-behavior-ubuntu-20-04/)
