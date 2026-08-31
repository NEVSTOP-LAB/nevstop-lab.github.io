---
title: 'dsh-deepseek-webchat'
linkTitle: 'dsh-deepseek-webchat'
description: 'Embed DeepSeek web chat (chat.deepseek.com) into DSH. Requirements & design. / 将 DeepSeek 网页版对话嵌入 DSH。需求与设计。'
weight: 0
draft: false
repo_name: 'NEVSTOP-LAB/dsh-deepseek-webchat'
repo_url: 'https://github.com/NEVSTOP-LAB/dsh-deepseek-webchat'
repo_language: 'JavaScript'
repo_stars: 0
repo_group: 'other'
---

> **NEVSTOP-LAB/dsh-deepseek-webchat** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/dsh-deepseek-webchat) · 语言：`JavaScript` · ⭐ 0
>
> Embed DeepSeek web chat (chat.deepseek.com) into DSH. Requirements & design. / 将 DeepSeek 网页版对话嵌入 DSH。需求与设计。

---

# DSH-DeepSeek-Webchat

在 DSH 中嵌入官方 [chat.deepseek.com](https://chat.deepseek.com/) 网页对话插件。通过 **同源透明反向代理** 把官方网页版带入 DSH，交互等效于浏览器打开，登录态在浏览器 Cookie 中持久，**不使用 API token**。

> 说明：官方网页版带 CSP `frame-ancestors 'none'`，直接 iframe 无法嵌入。本插件在宿主起一个反向代理，把官方响应改写为允许被本机 iframe 渲染，因此能获得完整、可交互、可持久登录的「网页版」体验，而不只是静态快照。

## 它能做什么

- **全局入口**：侧边栏「设置」旁新增「网页版」按钮，点击后弹出全屏覆盖层显示官方网页对话（带关闭按钮），体验等同浏览器打开。
- **每会话入口**：会话顶部视图环新增「网页版」标签，进入后自动定位到该会话关联的同一条官方对话并继续；首次进入（尚未关联）打开应用首页，创建的对话会自动记回该会话，后续重开回到同一条。
- **登录态持久**：在嵌入的官方网页里登录一次，`ds_session_id` 等 Cookie 会被重写为本机域并在浏览器 Cookie 中持久，之后自动复用。

## 实现方式

方案：**透明反向代理**（`/deepseek` 前缀路由）。

| 职责 | 位置 | 说明 |
| --- | --- | --- |
| 反向代理 | `index.js` | 把 `/deepseek/*` 转发到 `https://chat.deepseek.com/*`，保留方法/头部/流式 body |
| CSP 改写 | `index.js` | 把响应的 `frame-ancestors 'none'` → `frame-ancestors 'self'`，允许本机 iframe 渲染 |
| Cookie 持久 | `index.js` | 把官方 `Set-Cookie`（`ds_session_id` 等）重写为本机域（去 domain、本地失效掉 Secure、path 限定 `/deepseek/`），浏览器 Cookie 持久复用 |
| 会话映射 | `index.js` | 维护「DSH 会话 ↔ `chat_session_id`」映射，存到 `~/.dsh/dsh-deepseek-webchat/state.json` |
| Bridge 注入 | `index.js` | 在 HTML 文档中注入 `<script src="/deepseek/_dsw/bridge.js">`：上报当前 `chat_session_id` 并隐藏官方左侧历史区（最小注入） |
| 两个入口 | `lib/client.js` | 侧边栏入口（`sidebar.footer.action`）+ 全屏覆盖层（`shell.overlay`）+ 会话标签（`conversation.view`） |

## 安装

需要 [dsh CLI](https://github.com/deepseek-ai/deepseek-harness)（0.1.0-rc.6 及以上）。

从 GitHub 仓库安装：

```sh
dsh plugin --profile web add github:NEVSTOP-LAB/dsh-deepseek-webchat
```

> [!NOTE]
> `--profile web` 是默认 profile。桌面版（DSH Desktop）用 `--profile desktop`；其他 profile 把 `web` 换成对应名字即可。

建议锁定提交，避免后续更新改变实际内容：

```sh
dsh plugin --profile web add github:NEVSTOP-LAB/dsh-deepseek-webchat#<commit-sha>
```

也可以从构建产物 tarball 安装（本地打包）：

```sh
npm run pack                       # 生成 dist/dsh-deepseek-webchat-0.1.0.tgz
dsh plugin --profile web add ./dist/dsh-deepseek-webchat-0.1.0.tgz
```

安装后确认组合层里出现该插件：

```sh
dsh --profile web --dump-config
```

启动后，侧边栏「设置」旁出现「网页版」按钮；打开任一会话，顶部视图环出现「网页版」标签。

卸载：

```sh
dsh plugin --profile web remove dsh-deepseek-webchat
```

## 已知边界

- 本插件把官方网页以 iframe 形式渲染在本机同源下，交互等效官方网页，但不是浏览器原生标签页；个别浏览器快捷键、原生文件选择器等可能不完全透传。
- 会话映射依赖 bridge 从官方页面 DOM 上报 `chat_session_id`；官方改版可能影响该上报与「隐藏历史区」注入，需要时可降级为「每次新开对话」（默认首页）。
- 首次使用需在嵌入页手动登录一次；之后凭浏览器 Cookie 自动复用。

## 文档

- [需求方案（中文）](docs/requirements.zh.md)
- [Requirements (English)](docs/requirements.en.md)

## License

[MIT](LICENSE) © 2026 NEVSTOP-LAB

