---
layout: ../../../../layouts/PostLayout.astro
title: 《圖解 TCP/IP 網路通訊協定》筆記
slug: 2022/10/《圖解-tcp-ip-網路通訊協定》筆記
date: 2022/10/26
category: network
---

  
最近買了 [圖解 TCP/IP 網路通訊協定 (涵蓋IPv6)](https://www.tenlong.com.tw/products/9789865027063?list_name=i-rd) 來重新學習網路的相關知識，這本書真的不錯。雖然這本書是用由下至上（Bottom-up）的方式介紹網路，但讀完之後個人認為這樣的安排也很不錯。



  
看完之後我認為這本書是很營養的，因為除了網路的基本知識，它也介紹了與網路安全有關的機制。







<br><br>



  
它首先介紹網路的歷史，接著介紹了整本書會一直用到的「協定」一詞，並用圖表解釋 [OSI 模型](https://zh.wikipedia.org/wiki/OSI%E6%A8%A1%E5%9E%8B)，以及其每一層各司其職的特性。



  
底下我列出比較重要的概念，以及我覺得有用的部份：



  
- 第1章 網路的基礎知識  
  - 1.9 網路由哪些實體設備組成  
- 第2章 TCP/IP的基礎知識  
  - 2.5 OSI 每一層封包的模樣，以及封包傳遞到主機後，主機對封包的處理方式  
- 第3章 資料連結層（OSI Layer 2）  
  - 3.2 MAC address、共用媒體型網路、CSMA/CD、非共用媒體型網路、偵測迴圈、Spanning Tree、VLAN  
  - 3.4 無線通訊、WiFi、WPA2、藍芽、 ZigBee  
  - 3.5 PPP、PPPoE  
  - 3.7 ADSL、FTTH、VPN  
- 第4章 IP協定（網路層、OSI Layer 3）  
  - 4.1 網路層與資料連結層的關係  
  - 4.2 路由控制、Routing table  
  - 4.3 IP位置、廣播位置、群播、子網路遮罩、全球位置與私有位置  
  - 4.4 回送位置（127.0.0.1）、連結本地位址（169.254/16）  
  - 4.5 MTU、封包分割與重組、MTU探索  
  - 4.7 IPv4表頭  
- 第5章 IP的相關技術  
  - 5.2 DNS  
  - 5.4 ICMP  
  - 5.5 DHCP  
  - 5.6 NAT  
  - 5.8 IP任播、QoS、Mobile IP  
- 第6章 TCP與UDP（傳輸層、OSI Layer 4）  
  - 6.2 Port  
  - 6.3 UDP  
  - 6.4 TCP、ACK、重送、連線管理、Window、流量控制、壅塞控制、Nagle 演算法、Piggyback  
  - 6.5 QUIC  
- 第7章 路由協定  
  - 動態路由、路由範圍、EGP、IGP、RIP/RIP2、OSPF、MPLS  
- 第8章 應用協定（OSI Layer 7）  
  - 8.5 CGI  
  - 8.6 SNMP  
  - 8.7 HTTP Streaming、LDAP、NTP  
- 第9章 安全性  
  - 9.2 防火牆、IDS/IPS、DMZ、WAF  
  - 9.3 對稱加密、非對稱加密、PKI、SSO  
  - 9.4 IPsec、VPN、TLS/SSL、HTTPS、IEEE802.1X  
- 附錄D 雙絞線



<br><br>



  
## 參考



  
- [BPF](https://zh.wikipedia.org/zh-tw/BPF) – wikipedia  
- [透過 eBPF 觀察作業系統行為](https://hackmd.io/@sysprog/linux-ebpf) by 宅色夫
