---
title: 'csm-vsc-extension'
linkTitle: 'csm-vsc-extension'
description: 'csm-vsc-extension 中文 README：为 CSM 提供 Visual Studio Code 支持的插件。TypeScript · CSM 核心框架与工具。'
weight: 0
draft: false
repo_name: 'NEVSTOP-LAB/csm-vsc-extension'
repo_url: 'https://github.com/NEVSTOP-LAB/csm-vsc-extension'
repo_language: 'TypeScript'
repo_stars: 0
repo_group: 'csm-core'
topics: ['labview-csm', 'typescript', 'vscode']
---

> **NEVSTOP-LAB/csm-vsc-extension** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/csm-vsc-extension) · 语言：`TypeScript` · ⭐ 0
>
> 为 CSM 提供 Visual Studio Code 支持的插件
>
> 主题：`labview-csm` · `typescript` · `vscode`

---

# Communicable State Machine(CSM) VSCode 支持

> 为 CSM 相关文件提供 Visual Studio Code 编辑器支持的插件。

## 功能概览

当前版本主要提供以下能力：

- `.csmlog` 日志查看与辅助阅读
- `.lvcsm` 配置文件编辑支持
- `CSM Modules` 侧边栏模块管理
- `CSM File Icons` 文件图标主题
- 中英文界面本地化

### `.csmlog` 文件支持

- ✅ 日志事件、时间戳、模块名和关键参数高亮
- ✅ Hover 悬停提示，便于快速查看常见字段含义
- ✅ Outline 大纲，便于定位关键配置和系统消息
- ✅ 自动编码识别，降低常见中文日志乱码风险

### `.lvcsm` 文件支持

- ✅ 配置文件语法高亮
- ✅ Outline 大纲，便于快速浏览配置节
- ✅ 自动编码识别，降低常见中文配置文件乱码风险

### CSM 模块管理

侧边栏 `CSM Modules` 视图，用于浏览、搜索和管理 CSM 模块仓库：

- ✅ 在统一侧边栏中同时查看工作区模块、未管理文件夹和 GitHub 模块目录
- ✅ 支持 GitHub 登录、搜索、筛选、排序和多选批量操作
- ✅ 支持 README 预览、图片显示，以及仓库 `Star` / `Unstar`
- ✅ 支持将模块引入、更新、移除，并在 `copy` / `submodule` 模式间切换
- ✅ 本地已管理模块默认以只读 lock 状态保存，可在侧边栏中解锁或重新锁定，状态会写回 `csm-modules.yaml`
- ✅ 工作区模块卡片支持右键上下文菜单，已管理模块提供 Open Folder、Open README、Update 和 Remove 操作，未管理文件夹提供 Open Folder 操作
- ✅ 支持将本地未管理文件夹关联到已有模块仓库，或直接发布为新的 GitHub 仓库

### 文件图标主题

- ✅ 为 `.csmlog` 与 `.lvcsm` 提供专用文件图标

## 更多信息

- 使用说明与常见入口：[`docs/user-guide.md`](docs/user-guide.md)
- 模块管理详解：[`docs/module-management.md`](docs/module-management.md)
- 开发与调试：[`docs/quickstart.md`](docs/quickstart.md)
- 参与贡献：[`CONTRIBUTING.md`](CONTRIBUTING.md)

