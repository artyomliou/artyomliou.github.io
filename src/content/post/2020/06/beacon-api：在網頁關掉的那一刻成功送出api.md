---
layout: ../../../../layouts/PostLayout.astro
title: 事件API專武：Beacon API
slug: 2020/06/beacon-api：在網頁關掉的那一刻成功送出api
date: 2020/6/14
category: javascript
tags: 
  - ajax
  - javascript
---

  
經典使用場景是用來****蒐集事件並傳送到後端伺服器****<br>
因為只是要蒐集事件，所以其實直接往後端傳即可，根本不用在乎後端回傳什麼<br>
這樣就跟一般AJAX差很多了



  
>   
Example use cases of the Beacon API are logging activity and sending analytics data to the server.



  
尤其是在****網頁要關掉那一刻****傳出的事件，用原本的AJAX是包準傳不出去的<br>
為什麼？<br>
因為瀏覽器不會理會那些在網頁關閉瞬間要求的AJAX，但Beacon API送出去的可以



  
## **如何使用**



  
必須要考慮[支援程度](https://caniuse.com/#search=beacon)的問題



  
其實是老生常談了，想用比較潮的API就是該死<br>
IE根本跟樂高一樣



  
偵測支不支援的方式如下



  
```
if (navigator.sendBeacon) {
  // support
} else {
  // not supported
}
```



  
#### example



  
如果要單純的API範例可以去[Using the Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API/Using_the_Beacon_API)這邊看<br>
我個人覺得Beacon必須要有Ajax做備援方案拉<br>
所以底下的寫法會比較兼容一點



  
比如說我要傳送前端的事件給後端…



<script src="https://gist.github.com/artyomliou/dc7ee578860467ac7ce9741395014630.js"></script>



  
可以運作的範例可以參考[這裡](http://jsfiddle.net/tawowohzyk/2jb71cwn/)
