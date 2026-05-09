---
title: 'LabVIEW-MassData-Smart-Ptr'
linkTitle: 'LabVIEW-MassData-Smart-Ptr'
description: 'LabVIEW MassData Smart Pointer Library for Large Memory Requirement/High Speed DAQ Scenario'
weight: -4
draft: false
repo_name: 'NEVSTOP-LAB/LabVIEW-MassData-Smart-Ptr'
repo_url: 'https://github.com/NEVSTOP-LAB/LabVIEW-MassData-Smart-Ptr'
repo_language: 'LabVIEW'
repo_stars: 4
repo_group: 'labview-libs'
topics: ['daq', 'framework', 'labview', 'labview-library', 'vipm']
---

> **NEVSTOP-LAB/LabVIEW-MassData-Smart-Ptr** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/LabVIEW-MassData-Smart-Ptr) · 语言：`LabVIEW` · ⭐ 4
>
> LabVIEW MassData Smart Pointer Library for Large Memory Requirement/High Speed DAQ Scenario
>
> 主题：`daq` · `framework` · `labview` · `labview-library` · `vipm`

---

# LabVIEW-MassData-Smart-Ptr

[![Check_Broken_VIs](https://github.com/NEVSTOP-LAB/LabVIEW-MassData-Smart-Ptr/actions/workflows/Check_Broken_VIs.yml/badge.svg)](https://github.com/NEVSTOP-LAB/LabVIEW-MassData-Smart-Ptr/actions/workflows/Check_Broken_VIs.yml)
[![Build_VIPM_Library](https://github.com/NEVSTOP-LAB/LabVIEW-MassData-Smart-Ptr/actions/workflows/Build_VIPM_Library.yml/badge.svg)](https://github.com/NEVSTOP-LAB/LabVIEW-MassData-Smart-Ptr/actions/workflows/Build_VIPM_Library.yml)

![演示](https://images.gitee.com/uploads/images/2018/0822/160314_566fec33_136753.png "屏幕截图.png")

## 支持的数据类型

 - Memory (任意数据 Flattern To String 后，进行传输)
 
## 流程说明

参考 `_Example/MDPtr Process Example.vi`     

![image](https://user-images.githubusercontent.com/8196752/120073784-68db5c80-c0cc-11eb-9906-d7de478bd6b1.png)

## 应用实例

参考 `_Example/MDPtr DAQ Example.vi`    

利用 MDPtr 将采集到的 Sine/Square 两个波形数据文件，发送到显示、数据保存两个模块使用。   

后面板逻辑：    
![image](https://user-images.githubusercontent.com/8196752/120073829-932d1a00-c0cc-11eb-8779-8229187e1c61.png)

