---
layout: ../../../../layouts/PostLayout.astro
title: 用 Scout Suite 偵測 AWS 的設定是否足夠安全
imgSrc: 
slug: 2022/04/用-scout-suite-偵測-aws-的設定是否足夠安全
---

  
聽到有這種工具應該算是目前專案帶給我的一大收穫



  
[Scout Suite](https://github.com/nccgroup/ScoutSuite) 可以掃描一個 AWS 帳號下所有 resource 的設定是否足夠安全，<br>
舉例來說：Security group outbound 是否設為 0.0.0.0/0、是否有 IAM Policy [開放全部權限](https://console.aws.amazon.com/iam/home#policies/arn:aws:iam::aws:policy/AdministratorAccess)







  
在[這頁面](https://github.com/nccgroup/ScoutSuite/wiki/Setup)有教怎麼安裝，使用的狀況如下圖



![](/13310971/78389085-22659d00-75b0-11ea-9f22-ea6fcaa6a1cd.gif)



<br><br>



  
在圖中是使用預先放在 ~/.aws/credentials 裡面的金鑰<br>
這份金鑰的 IAM user 需要下面兩個 managed policy：



  
- [ReadOnlyAccess](https://us-east-1.console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FReadOnlyAccess)   
- [SecurityAudit](https://us-east-1.console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FSecurityAudit) 



  
跑完之後會得到一份 HTML 報告，從裡面也可以匯出 CSV



<br><br>



  
不過要再次強調，Scout Suite 會掃描單一帳號下的**所有資源**<br>
若是你正在開發新專案，而且將會把這專案的 ScoutSuite 報告交給外部人員稽核<br>
那最好早點開一支新帳號來做開發<br>




<br><br>



  




  
這工具會掃出一些我覺得很有趣的事情：



  
- 有沒有開 [CloudTrail](https://aws.amazon.com/tw/cloudtrail/)  
- EBS Snapshot、Volume [是否有加密](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html)  
- Security group 是否對全網開放  
- ELB 是否有開 [Drop invalid header fields](https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ELBv2/drop-invalid-header-fields-enabled.html#)  
- IAM 是否有 [cross-account role](https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html) 沒用 external id 或 MFA 保護  
- [IAM 密碼政策](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html)



  

