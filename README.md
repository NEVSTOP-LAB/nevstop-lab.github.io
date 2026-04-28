# nevstop-lab.github.io

该仓库使用 Hugo 构建，并采用 Doks 主题。

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

- `hugo.toml`：站点主配置。
- `content/`：页面与文章内容。
- `.github/workflows/hugo.yml`：GitHub Pages 自动构建与发布。

## 发布

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。
