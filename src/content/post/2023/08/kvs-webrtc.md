---
layout: ../../../../layouts/PostLayout.astro
title: KVS WebRTC
imgSrc: /wp-content/uploads/2023/08/螢幕擷取畫面-2023-08-19-160246.png
slug: 2023/08/kvs-webrtc
---

  
### 本篇文章的目標



  
這篇文章想要用精簡的方式描述如何成功使用 KVS WebRTC 建立 WebRTC 連線<br>
方便自己日後複習，也讓想使用這服務的人在閱讀官方文件前先建立基本觀念



  
建議繼續看下去之前，先閱讀[《NAT 穿透是如何工作的：技术原理及企业级实践》](https://zhuanlan.zhihu.com/p/433511472)的 1 ~ 6 章，以及 7.8 章



<br><br>



  
### KVS WebRTC 提供什麼、解決了什麼




  
- Signaling channel：一個可以交換資訊的管道，提供想直接連線的客戶端可以透過它交換 SDP Offer、SDP Answer，以及他們各自的 IP、Port



  
- Ice server：包含以下兩者



  
- STUN：讓客戶端可以獲得自己連到網際網路時用的 IP、Port



  
- TURN：客戶端之間無法直連時，TURN Server 可以當作替代方案，中轉客戶端之間的流量




<br><br>



  
### 事前設定




  
- 一個有足夠權限的 AWS 帳號

  
  - 可以建立 IAM Role



  
  - 可以執行 STS AssumeRole



  
  - 可以建立 KVS Signaling Channel





  
- Debug 工具

  
  - Chrome 的 about:webrtc



  
  - Firefox 的 about:webrtc





  
- SDK

  
  - 請到[這個頁面](https://docs.aws.amazon.com/kinesisvideostreams-webrtc-dg/latest/devguide/webrtc-sdks.html)下載您可以使用的SDK 






<br><br>



  
### 連線流程介紹



  
#### 建立 Signaling Channel



  
Signaling Channel 有角色區別，分為 Master、Viewer<br>
每個頻道只能有一個 Master，但能有十個 Viewer<br>
比如我們有一個監視器，監視器適合當 Master，並讓最多 10 個 Viewer（客戶端）連進去交換連線資訊



  
因此有幾個監視器，就要建立幾個 Signaling channel



  
建立完成後，每個 Signaling channel 有名稱、ARN、Tag 等資訊供後續使用



<br><br>



  
#### 連線到 Signaling Channel



  
Master、Viewer 要各自完成的步驟：




  
1. 用各種方式取得臨時金鑰

  
  - [STS AssumeRole](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_request.html#api_assumerole)：由後端幫已檢驗過的使用者申請金鑰



  
  - [IoT Core Credential Provider](https://docs.aws.amazon.com/zh_tw/iot/latest/developerguide/authorizing-direct-aws.html)：用 x509 憑證兌換金鑰



  
  - [Cognito Identity Pool](https://docs.aws.amazon.com/zh_tw/cognito/latest/developerguide/cognito-identity.html)：我聽過但沒用過





  
2. 用 SDK 執行 [GetSignalingChannelEndpoint()](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/API_GetSignalingChannelEndpoint.html) 取得後續 API 要用的 Endpoint，會取得 HTTPS、WSS 兩種



  
3. 用 SDK 執行 [GetIceServerConfig()](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/API_signaling_GetIceServerConfig.html) 取得 Ice server 資訊



  
4. 用 SDK 連線到第二步取得的 WSS Endpoint




<br><br>



  
#### 在兩個客戶端間建立連線



  
承上，Master、Viewer 各自對 WSS Endpoint 建立 WebSocket 連線，並大致按照下列順序交換連線資訊，並嘗試連線



![](/wp-content/uploads/2023/08/螢幕擷取畫面-2023-08-19-160246.png)



<br><br>



  
### 參考




  
- [Signaling and video calling](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling)：這篇文章裡面的連線流程圖比我詳細很多，在開發時值得參考，但有部分流程跟我不一樣



  
- [BlogGeek.me – Trickle ICE](https://bloggeek.me/webrtcglossary/trickle-ice/)：本篇文章的「先交換 Offer、Answer 然後才交換 Ice candidate」的做法叫做 Trickle ICE



  
- [WebRTC for the curious](https://webrtcforthecurious.com/)：這個網站針對 WebRTC 的每個部分有深入的解釋，適合想要特地研究某部分的人閱讀

