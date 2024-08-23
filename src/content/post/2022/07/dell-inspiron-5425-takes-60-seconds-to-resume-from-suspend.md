---
layout: ../../../../layouts/PostLayout.astro
title: Dell Inspiron 5425 Takes 60 Seconds To Resume From Suspend
imgSrc: /wp-content/uploads/2022/07/photo_2022-07-01_17-14-47.jpg
slug: 2022/07/dell-inspiron-5425-takes-60-seconds-to-resume-from-suspend
---

  
  
 | Computer | Dell Inspiron 5425 |  
 | --- | --- |   
 | CPU | AMD Ryzen 5625U ([Barcelo](https://www.amd.com/en/product/11631)) |  
 | RAM | 16GB |  
 | SWAP | 20GB |  
 | SSD | [SK Hynix 512GB BC711](https://product.skhynix.com/products/ssd/cssd/pc711.go) (firmware: 41002131) |  
 | BIOS | 1.2.1 |  
 | OS | Ubuntu 22.04 |  
 | Linux Kernel | 5.15.0-40-generic







<br><br>



  
## No S3 support and always S0



  
Because S3 should be fast because it means “suspend to RAM”, and S4 means “suspend to DISC”, so I doubt that this computer always suspends to S4. By running command below, it means this laptop does not have S3 state support and it always suspend to S0 state.



  
 |  
 | `sudo dmesg | grep S0` | [    0.417411] ACPI: PM: (supports S0 S4 S5) |  
 | --- | --- |   
 | `sudo cat /sys/power/state` | freeze mem disk |  
 | `sudo cat /sys/power/mem_sleep` | [s2idle] |  
 | `sudo journalctl -k | grep "suspend"` | kernel: PM: suspend entry (s2idle)



<br><br>



  
## Follow best practice to debug suspend



  
[“Best practice to debug Linux* suspend/hibernate issues”](https://01.org/blogs/rzhang/2015/best-practice-debug-linux-suspend/hibernate-issues) is a complete guide to narrow down the problem if possible. So my situation matches “**4.8 Long latency during suspend/resume (STI/STR/Hibernation)**” so I do whatever it says. I follow [this guide](https://askubuntu.com/questions/1412336/kernel-hang-on-resume-from-suspend-on-ubuntu-22-04) to add “initcall_debug no_console_suspend” into boot options and reboot. Disable async suspend by `"echo 0 > /sys/power/pm_async"`. Then suspend with [intel/pm-graph](https://github.com/intel/pm-graph) tool and this command `"./analyze_suspend.py -rtcwake 30 -f -m freeze"`. After resuming, this tool generates report and it looks like this.



![](/wp-content/uploads/2022/07/photo_2022-07-01_16-49-22-1024x583.jpg)64 seconds to resume



![](/wp-content/uploads/2022/07/photo_2022-07-01_17-12-19.jpg)**nvme** takes 61645.433 ms to resume



![](/wp-content/uploads/2022/07/photo_2022-07-01_17-14-47.jpg)Caused by nvme



<br><br>



  
## Dmesg & ftrace logs



  
dmesg logs:



  
```
[  559.976755] nvme 0000:02:00.0: PM: calling pci_pm_resume+0x0/0xf0 @ 3616, parent: 0000:00:01.2
[  592.948075] nvme nvme0: I/O 407 QID 1 timeout, aborting
[  592.948110] nvme nvme0: I/O 408 QID 1 timeout, aborting
[  592.948137] nvme nvme0: I/O 337 QID 11 timeout, aborting
[  592.948153] nvme nvme0: I/O 338 QID 11 timeout, aborting
[  621.620012] nvme nvme0: I/O 6 QID 0 timeout, reset controller
[  621.621983] nvme nvme0: Abort status: 0x371
[  621.621995] nvme nvme0: Abort status: 0x371
[  621.622003] nvme nvme0: Abort status: 0x371
[  621.622011] nvme nvme0: Abort status: 0x371
[  621.622029] PM: dpm_run_callback(): pci_pm_resume+0x0/0xf0 returns -16
[  621.622156] nvme 0000:02:00.0: PM: pci_pm_resume+0x0/0xf0 returned -16 after 61645374 usecs
[  621.622190] nvme 0000:02:00.0: PM: failed to resume: error -16
[  621.622223] mt7921e 0000:03:00.0: PM: calling pci_pm_resume+0x0/0xf0 @ 3616, parent: 0000:00:02.2
[  621.669436] nvme nvme0: 16/0/0 default/read/poll queues
```



  
ftrace logs: [https://blog-img.artyomliou.ninja/wp-content/uploads/2022/07/ftrace_20220701.txt](https://blog-img.artyomliou.ninja/wp-content/uploads/2022/07/ftrace_20220701.txt)



<br><br>



  
## Related resources



  
The thread “[NVME fails to reset after resume from sleep on “Lenovo Thinkpad P14s Gen 2 AMD” when IOMMU is enabled](https://gitlab.freedesktop.org/drm/amd/-/issues/1910)” on gitlab shows that `"iommu=pt"` in boot options could be a workaround, but it does not work for me.



  
Tried but not working solutions as below:



  
- iommu=pt  
- amd_iommu=pt  
- Boot with 5.18 kernel



  
 |  
 | `iommu=pt` | Not working |  
 | --- | --- |   
 | `amd_iommu=pt` | Not working |  
 | `iommu=soft` | Not working |  
 | `iommu=off` | Not working, WIFI down |  
 | Boot with 5.18 kernel | Not working



<br><br>



  
## Response from Dell Support



  
They said that they wont fix this, because Ubuntu is free to use, not commercial.



<br><br>



  
## References



  
- [https://www.kernel.org/doc/Documentation/power/states.txt](https://www.kernel.org/doc/Documentation/power/states.txt)  
- [https://01.org/blogs/rzhang/2015/best-practice-debug-linux-suspend/hibernate-issues](https://01.org/blogs/rzhang/2015/best-practice-debug-linux-suspend/hibernate-issues)  
- [https://askubuntu.com/questions/19486/how-do-i-add-a-kernel-boot-parameter](https://askubuntu.com/questions/19486/how-do-i-add-a-kernel-boot-parameter)  
- [https://github.com/intel/pm-graph](https://github.com/intel/pm-graph)  
- [https://askubuntu.com/questions/1412336/kernel-hang-on-resume-from-suspend-on-ubuntu-22-04](https://askubuntu.com/questions/1412336/kernel-hang-on-resume-from-suspend-on-ubuntu-22-04)  
- [https://www.kernel.org/doc/Documentation/x86/x86_64/boot-options.txt](https://www.kernel.org/doc/Documentation/x86/x86_64/boot-options.txt)  
- [Dell Inspiron 14 4254 – Ryzen 5 5650U frozen for 1min after suspend](https://bbs.archlinux.org/viewtopic.php?id=277428)  
- [https://linrunner.de/tlp/settings/runtimepm.html](https://linrunner.de/tlp/settings/runtimepm.html)
