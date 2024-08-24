---
layout: ../../../../layouts/PostLayout.astro
title: JS 的 Math.floor()、Math.trunc()、~~num
imgSrc: /wp-content/uploads/2023/01/螢幕擷取畫面-2023-08-19-114123.png
slug: 2023/01/js-取整數常用的-math-floor-與-math-trunc-以及-num-的差異
date: 2023/1/5
category: javascript
tags: 
  - bitwise
  - integer
  - javascript
---

  
在 Javascript 裡面，整數、浮點數沒有區隔<br>
比如我寫 `11 / 2` 會拿到 `5.5`，但在 Java 會拿到 `5`<br>
因此在使用 Javascript 除法的時候，我們時常要在除法外面包一層 [Math.floor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)



  
我們的預期是 `Math.floor(5.5)` 會回傳 `5`<br>
所以我們也預期 `Math.floor(-5.5)` 會回傳 `-5`……，但其實會回傳 `-6`



  
改用 [Math.trunc()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc) 就可以了，寫法是 `Math.trunc(-5.5)`







<br><br>



  
但其實還有一種神奇寫法：`~~(-5.5)`<br>
[MDN Bitwise NOT](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT) 的介紹中提到：每一個 `~` 都會把數字轉成 32-bit signed integer<br>
如此一來就會達成我們要的「丟棄小數，只留整數」的目的



  
不過這樣的寫法有問題<br>
[Javascript 的整數](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#number_encoding)涵蓋 `-253 + 1 到 253 - 1` 這麼大的範圍<br>
這樣寫會把超過 32 bit 的資料丟掉，像是 `~~(2 ** 33 + 50)` 這樣就只會回傳 `50`<br>
Math.trunc() 的文件有一章專門在講這個：[Using bitwise no-ops to truncate numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc#using_bitwise_no-ops_to_truncate_numbers)



<br><br>



  
會知道這個，其實也是刷題時學到的<br>
以前常會覺得「刷題的東西在工作上都用不到」<br>
現在倒是覺得刷題是蠻開眼界的事情，而在這過程中便會學到一些工作上可以應用的技巧
