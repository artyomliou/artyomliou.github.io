---
layout: ../../../../layouts/PostLayout.astro
title: Invoke Lambda URL with Awscurl
imgSrc: 
slug: 2022/04/invoke-lambda-url-with-awscurl-tool
---

  
[Lambda URL](https://aws.amazon.com/tw/about-aws/whats-new/2022/04/aws-lambda-function-urls-built-in-https-endpoints/) was general available three days ago.<br>
Although it’s possible to invoke Lambda URL without authorization, but I find [the AWS_IAM auth type](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html#urls-auth-iam) with cross-account feature suits my need better.







<br><br>



  
Belows is a paragraph about cross-account invoking, and its illustration



![](/wp-content/uploads/2022/04/Screenshot-2022-04-09-at-20-25-20-Security-and-auth-model-for-Lambda-function-URLs-AWS-Lambda.png)



[](https://blog-img.artyomliou.ninja/wp-content/uploads/2022/04/lambda-function-url-cross-account-illustration.png)



<br><br>



  
And the [Invoking function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html) chapter did mention there’s many helpful tool to send request with signature, no manual signing!<br>
Here is how to use [awscurl](https://github.com/okigan/awscurl) to make cross-account request:



  
```
awscurl  -v -X POST https://foobarhelloworldlorem.lambda-url.ap-northeast-1.on.aws/ --service lambda --region ap-northeast-1
```
