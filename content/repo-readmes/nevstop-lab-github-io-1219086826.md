---
title: 'nevstop-lab.github.io README'
description: '自动同步自 NEVSTOP-LAB/nevstop-lab.github.io 的中文 README'
draft: false
---

> 自动同步来源： [NEVSTOP-LAB/nevstop-lab.github.io](https://github.com/NEVSTOP-LAB/nevstop-lab.github.io)
> 导入规则：仅根据 README 是否包含中文判断，正文保持原文。

# nevstop-lab.github.io

该仓库已从 Jekyll 迁移为 Hugo，并使用 Doks 主题。

## 本地预览

1. 安装 Hugo Extended（建议最新版）。
2. 在仓库根目录运行：

```bash
hugo server
```

3. 浏览器打开 `http://localhost:1313`。

## 目录说明

- `hugo.toml`：站点主配置。
- `content/`：页面与文章内容。
- `.github/workflows/hugo.yml`：GitHub Pages 自动构建与发布。

## 发布

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。
