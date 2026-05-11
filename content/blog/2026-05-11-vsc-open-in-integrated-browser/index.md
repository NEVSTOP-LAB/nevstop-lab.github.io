---
title: "20分钟搓了个 VSCode 插件——需求痒了就自己挠"
description: "试用 HTML 写文档碰到了预览麻烦，插件市场没有趁手的，就用 DeepSeek + Copilot 自己做了一个。实际动手不超过 20 分钟。"
date: 2026-05-11T19:00:00+08:00
draft: false
contributors:
  - "nevstop-lab"
---

最近脑子里转着一个问题：**AI 时代，文档该用什么格式写？**

## 先扯两句背景：HTML 会是比 Markdown 更好的文档格式吗？

这个问题最近在 AI 圈挺火的。核心逻辑大概是这样——Markdown 是给"人看"设计的轻量标记，但 AI 处理的时候，其实更喜欢语义清晰的 HTML：标题就是 `<h1>`，列表就是 `<ul>`，表格就是 `<table>`，不用猜，不用转换，结构一目了然。更别说 Markdown 本身有好几套方言，各家渲染略有差异，遇到复杂排版就开始抖——而 HTML 在这方面基本不含糊。

当然，HTML 写起来没那么轻松。不过现在有了 AI 辅助，手写 HTML 的成本已经降了不少，甚至可以让 AI 直接生成文档结构。

所以我就开始试了：**把一部分文档从 Markdown 切换成 HTML**，看看实际效果怎么样。

然后马上撞到了一个现实问题。

## 预览 HTML 文件，VSCode 里居然挺麻烦的

在 VSCode 里预览 Markdown，直接点右上角的"预览"按钮就行，一秒的事。HTML？没有这个按钮。得自己开命令面板，找 `Simple Browser: Show`，再把文件路径复制粘进去。每次改完文件重新预览，还得再来一遍……

我去插件市场找了一圈，没有我想要的那种——**右键文件直接"在内置浏览器里打开"**，简单利落，不折腾。

算了，需求痒了就自己挠。

## 动手：实际 20 分钟搞定

中间有好长一段时间在做别的事，真正坐下来搞这个，前后估计就 20 分钟。

**先和 DeepSeek 对了一下需求**，让它帮我整理成给 Copilot 用的提示词，主要是把 VSCode 插件 API 里的关键点点出来——`simpleBrowser.api.open`、`when` 条件、菜单注册这些。这步不跳过，后面 AI 生成的代码准确率会高很多。

然后 GitHub 建好仓库，提示词扔给 **Copilot（claude-opus-4.7）**，等了一会儿，出来了：

- 右键 Explorer 文件 → "Open in Integrated Browser" ✅
- 编辑器 Tab 右键也有 ✅
- 文件类型可配置（默认支持 `html`、`htm`、`pdf`、`xml`、`md` 等）✅
- 中英文本地化 ✅

代码是 TypeScript，构建用 esbuild，工程结构干净规范，基本上没什么要挑的。后面又跑了两个小 PR 修了本地化细节、对齐测试配置，都是 Copilot 自己完成的。

装进 VSCode 测了一下，右键 `.html`，Simple Browser 弹出来，完事。

## 有一点要说实话

如果你从没发布过 VSCode 插件，光是搞清楚发布流程（注册 Azure DevOps 账号、生成 PAT、用 `vsce` 打包上传）可能就要花不少时间——不难，但第一次总要摸索一遍。

我之前发过 [**Communicable-State-Machine-Toolkit**](https://marketplace.visualstudio.com/items?itemName=NEVSTOP-LAB.csm-toolkit)，流程熟，这次直接绕过了这段"学习成本"。所以你如果也想试试用 AI 快速做个插件，最好先把发布这关打通，后面就是纯体力活了。

## 两个插件，顺手推一下

**🔧 Communicable-State-Machine-Toolkit**
[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/NEVSTOP-LAB.csm-toolkit)](https://marketplace.visualstudio.com/items?itemName=NEVSTOP-LAB.csm-toolkit)

写 LabVIEW CSM 程序的必备，代码片段、文档跳转、语法高亮都有，装了就不想卸。

**🌐 Open in Integrated Browser**
[![GitHub](https://img.shields.io/badge/GitHub-vsc--open--in--integrated--browser-blue)](https://github.com/NEVSTOP-LAB/vsc-open-in-integrated-browser)

本文的主角。右键任意支持的文件，直接在 VSCode 内置 Simple Browser 里打开。支持的扩展名可以自己配，默认有 `html`、`htm`、`pdf`、`xml`、`xsl`、`txt`、`md`。你要是也在试 HTML 文档这条路，装上可以省不少麻烦。

---

有需求、有工具、有点背景知识，20 分钟的事。AI 时代的小工具，基本上就这个节奏。
