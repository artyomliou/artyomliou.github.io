---
layout: ../../../../layouts/PostLayout.astro
title: 逕行升級 Terraform 遇到 “data could not be decoded from the state”
slug: 2022/05/逕行升級-terraform-遇到-data-could-not-be-decoded-from-the-state
date: 2022/5/5
category: terraform
tags: 
  - cloudfront
  - terraform
---

  
我曾經用舊版 Terraform 佈署一個環境（約 0.11 版）<br>
在那之後再也沒動過該環境<br>
直到今天用新版 Terraform 打算去做 refresh、destroy<br>
根據錯誤訊息，Terraform 無法解讀 state 中 `aws_cloudfront_distribution` 的 `active_trusted_signers`







  
還好在[這篇 Github issue 的 comment](https://github.com/hashicorp/terraform/issues/25752#issuecomment-672217777) 裡面有人給出解決方式<br>
是先用 `terraform state pull >> state.json` 把 state dump 出來<br>
再手動根據[這篇文章](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/version-3-upgrade#active_trusted_signers-attribute-name-and-type-change)的說明去改 state.json<br>
並且手動將 state.json 的 “serial” 加一<br>
接著執行 `terraform state push state.json` 即可
