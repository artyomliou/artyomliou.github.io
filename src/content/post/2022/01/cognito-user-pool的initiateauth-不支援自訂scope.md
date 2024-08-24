---
layout: ../../../../layouts/PostLayout.astro
title: Cognito User Pool 的 initiateAuth() 不支援自訂scope
slug: 2022/01/cognito-user-pool的initiateauth-不支援自訂scope
date: 2022/1/6
category: cognito-user-pool
tags: 
  - aws
  - aws-sdk
  - cogntio
  - oauth2
---

  
最近公司某專案因為要讓 C# client 接上 Cognito，不過在 OAuth2 的 redirect 有困難，<br>
所以我又想試試看讓 C# client 透過 AWS SDK 的 cognito.initiateAuth() 讓使用者做登入。



  
我是用 Vue.js 來寫 POC，<br>
登入成功之後發現拿到的 access_token 的 scope 只有 `aws.congito.signin.user.admin` 一個。<br>
這個 bug 會讓我們的 access_token 無法通過 API Gateway 的 JWT Authorizer 認証。



  
這個情況在 [AWS Cognito AdminInitiateAuth all custom scopes are missing](https://stackoverflow.com/questions/59916001/aws-cognito-admininitiateauth-all-custom-scopes-are-missing) 這篇文章也有提到，<br>
另外在 [Custom scopes in access token programmatically #684](https://github.com/aws-amplify/aws-sdk-android/issues/684) 這篇有人在向 AWS 許願可以讓 initiateAuth() 支援自訂 scope。<br>
在[這篇留言](https://github.com/aws-amplify/aws-sdk-android/issues/684#issuecomment-981415143)提到可以用 [Pre token generation](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html) 修改 ID token 的內容，well…



  
Cognito 跟 AppSync 在充滿 roadblock 的部份實在是很像…<br>

