---
layout: ../../../../layouts/PostLayout.astro
title: Configure Lambda Access To RDS Proxy With Terraform
slug: 2022/01/configure-lambda-access-to-rds-proxy-with-terraform
date: 2022/1/22
category: terraform
tags: 
  - rds
  - rds proxy
  - regex
  - terraform
---

  
To setup correct IAM policy allowing Lambda access RDS Proxy, you will need to get “prx” id in [aws_db_proxy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_proxy#attributes-reference).



<script src="https://gist.github.com/artyomliou/758da62874d8f093e02878a7398b4b04.js"></script>
