---
title: 'CSM-Mermaid-Plugin'
linkTitle: 'CSM-Mermaid-Plugin'
description: 'Mermaid Tool Plugin for CSM'
weight: -4
draft: false
repo_name: 'NEVSTOP-LAB/CSM-Mermaid-Plugin'
repo_url: 'https://github.com/NEVSTOP-LAB/CSM-Mermaid-Plugin'
repo_language: 'LabVIEW'
repo_stars: 4
repo_group: 'csm-core'
topics: ['labview', 'labview-csm', 'mermaid']
---

> **NEVSTOP-LAB/CSM-Mermaid-Plugin** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/CSM-Mermaid-Plugin) · 语言：`LabVIEW` · ⭐ 4
>
> Mermaid Tool Plugin for CSM
>
> 主题：`labview` · `labview-csm` · `mermaid`

---

# CSM-Mermaid-Plugin

> [!WARNING]
> 开发中...还未完成

通过 Mermaid 语法绘制 CSM 中的逻辑关系图。目前支持：

1. [x] 显示内部状态(Status)和接口(API)之间的订阅关系。
2. [ ] JKISM/CSM 模块内部的状态跳转逻辑
3. [ ] CSM 模块间的调用关系图
4. [ ] CSM 模块间的状态跳转逻辑图
5. [ ] mermaid界面显示提供缩放、移动位置等操作
6. [x] CSM 模块接口信息

### 状态(Status)和接口(API)之间的订阅关系

以 [CSM-Continuous-Meausrement-and-Logging](https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging) 运行状态(Status)和接口(API)之间的订阅关系为例：

![状态(Status)和接口(API)之间的订阅关系.table](https://raw.githubusercontent.com/NEVSTOP-LAB/CSM-Mermaid-Plugin/main/.doc/1.png)

![状态(Status)和接口(API)之间的订阅关系.mermaid](https://raw.githubusercontent.com/NEVSTOP-LAB/CSM-Mermaid-Plugin/main/.doc/2.png)

### CSM 的接口信息

![image](https://raw.githubusercontent.com/NEVSTOP-LAB/CSM-Mermaid-Plugin/main/.doc/4.png)
