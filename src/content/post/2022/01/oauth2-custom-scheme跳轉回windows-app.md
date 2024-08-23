---
layout: ../../../../layouts/PostLayout.astro
title: OAuth2 + Custom Scheme跳轉回Windows App
imgSrc: 
slug: 2022/01/oauth2-custom-scheme跳轉回windows-app
---

  
最近要把 Cognito User Pool 提供的 OAuth 登入功能串接到 Windows App，<br>
一路上遇到不少問題，透過這篇文章做紀錄







  
範例程式碼[點這裡](https://github.com/artyomliou/OAuth2-Redirect-Custom-Scheme-For-Windows-App)



![](/wp-content/uploads/2022/01/WindowsDesktopAppOauth-1024x502.jpg)



  




  
## 實驗紀錄



  
### 為什麼不用 AWS SDK 的 [initiateAuth()](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html) 做登入功能？



  
雖然確實可以拿到 access token、id token，但[無法自訂其中的 scope](https://github.com/aws-amplify/aws-sdk-android/issues/684)，所以讓這種 token 無法靈活運用。



  
 



  
 



  
### [OAuthDesktopApp](https://github.com/googlesamples/oauth-apps-for-windows/tree/master/OAuthDesktopApp) 這份範例的問題在哪？



  
因為 Cognito 需要開發人員先註冊 Redirect URI（最高 100 組），<br>
而這份程式碼是動態決定 port，並產生 Redirect URI （比如 http://localhost:1234/） ，<br>
可想而知開發的過程會很痛苦。



  
 



  
 



  
### 為什麼不用 OAuth2 Implicit Flow 做登入功能？



  
接續上一篇回答



  
即使把 port 寫死，<br>
登入成功後，瀏覽器會收到這樣的 HTTP request：


  
http://localhost:1234/#id_token=ID_TOKEN&access_token=ACCESS_TOKEN&token_type=bearer&expires_in=3600



  
接著瀏覽器會把 request 傳給 HttpListener，[再把 request 存在 context 變數裡面](https://github.com/googlesamples/oauth-apps-for-windows/blob/master/OAuthDesktopApp/OAuthDesktopApp/MainWindow.xaml.cs#L68-L103)，<br>
而你會發現你怎麼都無法拿到 token，<br>
因為[瀏覽器根本不會把 # 後面的東西傳給 HttpListener](https://stackoverflow.com/questions/940905/can-i-read-the-hash-portion-of-the-url-on-my-server-side-application-php-ruby)！！



  
 



  
 



  
### 為什麼使用 Custom Scheme 做跳轉是必要的？



  
不這麼做，勢必就要採用 localhost + port 的方案。



  
如果固定 port，則 port 被占用之後會無法處理跳轉；<br>
如果是動態 port，則要想辦法註冊新的 Redirect URI 到 Cognito，這太瘋狂惹。<br>
即使能把 port 控制 100 個數字之內，這樣的做法也不是最佳解。



  
 



  
 



  
### 如何為 Windows App 註冊 Custom Scheme？



  
參考 [Registering an Application to a URI Scheme using .NET (custom protocol)](https://www.meziantou.net/registering-an-application-to-a-uri-scheme-using-net.htm)



  
 



  
 



  
### 為什麼必須判斷是否為 first process？



  
因為瀏覽器根據 custom scheme 啟動 app的時候，會再啟動一次 app，造成第二個 process。<br>
而真正收到 redirect 請求的其實是第二個 process。



  
因此 app 每次啟動都要判斷是自己不是 first process，<br>
若否，就要把自己收到的 args 傳回去給 first process，這樣才能完成跳轉。



  
 



  
 



  
### App 如何判斷自己為 first process？



  
以這份 [gist](https://gist.github.com/LGM-AdrianHum/d16a6b49d1b7644b2b9f88f85db2d41e) 來說，他是透過 mutex 機制，[能取得 mutex 的 process 必定為 first](https://gist.github.com/LGM-AdrianHum/d16a6b49d1b7644b2b9f88f85db2d41e#file-singleinstance-cs-L24-L54)。



  
 



  
 



  
### Second process 如何傳送資料給 first process？



  
透過 Named pipe。<br>
[first process 會啟動 ServerStream](https://gist.github.com/LGM-AdrianHum/d16a6b49d1b7644b2b9f88f85db2d41e#file-singleinstance-cs-L70-L96)，而 second process 會透過 ClientStream 傳送資料。



  
 



  
 



  
### 如何在跳轉後讓 MainWindow 跳出來？



  
以下程式擷取自[這篇解答](https://stackoverflow.com/questions/48321034/wpf-application-authentication-with-google/48457204#48457204)


  
/// 
Brings main window to foreground.
  
        public void BringToForeground()<br>

        {<br>

            if (this.WindowState == WindowState.Minimized || this.Visibility == Visibility.Hidden)<br>

            {<br>

                this.Show();<br>

                this.WindowState = WindowState.Normal;<br>

            }
  
            // According to some sources these steps gurantee that an app will be brought to foreground.<br>

            this.Activate();<br>

            this.Topmost = true;<br>

            this.Topmost = false;<br>

            this.Focus();<br>

        }



  
 



  
 



  
### [Simon Mourier](https://stackoverflow.com/users/403671/simon-mourier) 的[這篇回答](https://stackoverflow.com/questions/48321034/wpf-application-authentication-with-google/48457204#48457204)優點在哪、缺點在哪？



  
優點：



  
- OAuthState、OAuthRequest、OAuthToken 封裝得非常漂亮  
- 透過 OAuthState，藉由登入與否改變 MainWindow 的畫面（如同 Vue.js）



  
缺點：



  
- 使用 built-in web browser，一開啟 Cognito Hosted UI 就會發生一堆 JS error  
- 仍然使用 HttpListener + 動態 port 產生 Redirect URI



  
 



  
 



  
### 如何做到登出？



  
程式方面直接把 Token 設為 null 即可。



  
不過用來登入的瀏覽器因為會有 cookie，所以瀏覽器上也要登出，或者一開始就用無痕模式登入。<br>
用無痕模式開啟登入畫面的程式如下：


  
// 在 edge 瀏覽器打開 Cognito 登入畫面<br>

// (inPrivate 參數可以避免瀏覽器 cookie 記住前一位登入的工讀生帳號)<br>

var authorizationRequestUri = “”;<br>

System.Diagnostics.Process.Start(new ProcessStartInfo()<br>

{<br>

    FileName = “msedge.exe”,<br>

    Arguments = string.Format(“–inPrivate –new-window –no-first-run \”{0}\””, authorizationRequestUri),<br>

    UseShellExecute = true<br>

});



  
接著如果是使用 Authorization Code Flow，則也需要註銷 refresh token，access token，<br>
具體的方式請參考 [REVOCATION endpoint](https://docs.aws.amazon.com/cognito/latest/developerguide/revocation-endpoint.html)
