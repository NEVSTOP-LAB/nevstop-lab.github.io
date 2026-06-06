---
title: 'csm-community-example'
linkTitle: 'csm-community-example'
description: 'csm-community-example 中文 README：使用 csm vscode extension + LabVIEW 创建的范例项目。LabVIEW · CSM 核心框架与工具。'
weight: 0
draft: false
repo_name: 'NEVSTOP-LAB/csm-community-example'
repo_url: 'https://github.com/NEVSTOP-LAB/csm-community-example'
repo_language: 'LabVIEW'
repo_stars: 0
repo_group: 'csm-core'
topics: ['labview-csm']
---

> **NEVSTOP-LAB/csm-community-example** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/csm-community-example) · 语言：`LabVIEW` · ⭐ 0
>
> 使用 csm vscode extension + LabVIEW 创建的范例项目
>
> 主题：`labview-csm`

---

# csm-community-example

配合 [CSM VSCode](https://github.com/NEVSTOP-LAB/csm-vsc-extension) 插件的模块管理功能，完成一个利用社区模块完成复杂任务的示例。

> [!NOTE]
> CSM VSCode 插件在市场中搜索 CSM 即可获取。

![screnshot](https://raw.githubusercontent.com/NEVSTOP-LAB/csm-community-example/main/_docs/Snipaste_2026-06-03_21-21-50.png)

- VSCode 插件管理目录下的 csm/ 文件夹，放置社区模块，插件会自动识别并加载。
- LabVIEW 自动发布 csm/ 目录，所有代码都加载到LabVIEW 中。
- VSCode 中可以编写模块和配置信息。
- LabVIEW 编写简单的主程序，调用模块完成任务。
