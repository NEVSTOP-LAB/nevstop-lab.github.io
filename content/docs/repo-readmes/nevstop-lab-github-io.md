---
title: 'nevstop-lab.github.io'
linkTitle: 'nevstop-lab.github.io'
description: 'nevstop-lab.github.io website'
weight: 0
draft: false
repo_name: 'NEVSTOP-LAB/nevstop-lab.github.io'
repo_url: 'https://github.com/NEVSTOP-LAB/nevstop-lab.github.io'
repo_language: 'HTML'
repo_stars: 0
repo_group: 'other'
---

> **NEVSTOP-LAB/nevstop-lab.github.io** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/nevstop-lab.github.io) · 语言：`HTML` · ⭐ 0
>
> nevstop-lab.github.io website

---

# nevstop-lab.github.io

NEVSTOP-LAB 组织的官方站点，使用 Hugo（Doks 主题）构建，自动部署到 GitHub Pages。

## 站点结构

- `/` —— 首页：组织 lead、站点导航卡片、CSM 生态速览、最新博客
- `/about/` —— 组织介绍：CSM Framework、社区、AI-Wiki 三段式（镜像 [`NEVSTOP-LAB/.github` 的 `profile/README.md`](https://github.com/NEVSTOP-LAB/.github/blob/main/profile/README.md)）
- `/docs/` —— 文档入口
- `/docs/repo-readmes/` —— **自动同步**自组织内 public 仓库的中文 README，按主题分组浏览
- `/blog/` —— 博客文章

## 本地预览

1. 安装 Node.js（建议 24+）与 Hugo Extended（建议最新版）。
2. 在仓库根目录安装前端依赖：

   ```bash
   npm ci
   ```

3. 启动本地预览：

   ```bash
   npm run dev
   ```

4. 浏览器打开 `http://localhost:1313`。

## 目录说明

- `hugo.toml`：站点主配置，包括主菜单、社交菜单与 `params`。
- `layouts/home.html`：自定义首页模板（替代 Doks 默认带 "Get Started" 按钮的模板）。
- `content/`：手写页面与文章。
- `content/docs/repo-readmes/`：**自动生成**目录，请勿手工编辑。
- `.github/workflows/hugo.yml`：构建并发布到 GitHub Pages。
- `.github/workflows/sync-chinese-readmes.yml`：每日 02:00 (UTC) 同步组织内 public 仓库的中文 README。
- `AGENTS.md`：维护本站点的提示词与硬约束，**修改站点结构前请先阅读**。

## 发布

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。

## 给后续协作者 / LLM Agent

请先阅读 [`AGENTS.md`](./AGENTS.md)，其中汇总了本次重设计的设计原则、字段约定与避坑事项（例如自动同步生成的 front matter 必须使用 `topics:` 而非 `tags:`，否则会触发 Doks 模板的 `contributors` 检查导致构建失败）。

如果你的 LLM 工具支持 **skills**（例如 GitHub Copilot Coding Agent / Claude），请直接调用：

```
skill: maintain-nevstop-lab-site
```

skill 文件位于 [`.github/skills/maintain-nevstop-lab-site/SKILL.md`](./.github/skills/maintain-nevstop-lab-site/SKILL.md)，**核心目的是让站点内容与组织最新状态保持同步**（profile README、组织 public 仓库列表、新博客 / 公告），而不是做样式美化。手册包含：站点速览、权威来源（source of truth）对照表、硬约束清单、5 类常见任务模式（**🟢 主任务**：手写内容回写、调整自动同步 workflow；**🟡 支持任务**：修复构建失败、调整布局样式、新增功能区）、本地构建验证步骤，以及自动创建 PR 的流程。


