---
layout: ../../../../layouts/PostLayout.astro
title: Savings Plans能節省多少EC2的花費？
slug: 2021/08/savings-plans能解省多少ec2的花費？
date: 2021/8/19
category: ec2
tags: 
  - ec2
  - savings-plans
---

  
我用的是 t3a.micro，隨需的原價是一小時 0.0122



  
  
 |  | Compute Savings Plans |  | EC2 Instance Savings Plans |  |  
 | --- | --- | --- | --- | --- |   
 |  | 1年 | 3年 | 1年 | 3年 |  
 | 不預繳 | 0.0096 | 0.007 | 0.0077 | 0.0053 |  
 | 部份預繳 | 0.0092 | 0.0064 | 0.0073 | 0.0049 |  
 | 全部預繳 | 0.009 | 0.0063 | 0.0072 | 0.0046



  
對於我這種開一台機器架 blog，好幾年不會動的人，買 EC2 Instance Savings Plans 的 3 年好像很適合R



  
0.0122 * 24小時 * 365天 * 3年 = 320鎂<br>
0.0046 * 24小時 * 365天 * 3年 = 120鎂



  
差真多R
