---
title: "20分钟搓了个 VSCode 插件——需求痒了就自己挠"
description: "试用 HTML 写文档碰到了预览麻烦，插件市场没有趁手的，就用 DeepSeek + Copilot 自己做了一个。实际动手不超过 20 分钟。"
date: 2026-05-11T19:00:00+08:00
draft: false
contributors:
  - "nevstop-lab"
---

> 本文根据知乎专栏原文补充细节并整理为站点版本。  
> 原文链接：https://zhuanlan.zhihu.com/p/2037600105537201607

最近脑子里转着一个问题：**AI 时代，文档该用什么格式写？**

## 先扯两句背景：HTML 会是比 Markdown 更好的文档格式吗？

这个问题最近在 AI 圈挺热闹的，争议不小。

传统认知是 Markdown 更轻量、更好写，已经够用了。但反驳的人说：Markdown 本质上是给"人看"设计的，语义其实很贫乏——`#` 就是标题，`-` 就是列表，仅此而已。遇到复杂结构（嵌套表格、注释、侧边说明、元数据），Markdown 就开始捉襟见肘，而且各家渲染方言不统一，写得稍微复杂一点就容易跑偏。

HTML 这边的论据是：语义结构更丰富、更精确。`<h1>` 就是主标题，`<article>` 就是一篇文章，`<aside>` 就是旁注，标签本身带含义，不用靠上下文猜。对于 AI 来说，这意味着：

- **更准确的内容理解**：解析 HTML 不需要猜测，`<table>` 就是表格，不存在 Markdown 表格写法不统一的问题。
- **更细的分块粒度**：做 RAG 知识库的时候，HTML 可以按 `<section>`、`<article>` 自然分块，边界清晰；Markdown 只能靠 `#` 标题分割，颗粒度粗。
- **元数据更容易抽取**：作者、时间、摘要、关键词可以直接用 `<meta>` 标签结构化存储，不用再写 YAML Front Matter 然后单独解析。
- **复杂内容表达力更强**：公式、交互元素、嵌套布局，HTML 原生支持，Markdown 要么放弃要么靠 hack。

当然，HTML 写起来确实比 Markdown 啰嗦。不过现在有了 AI 辅助，让 AI 直接生成 HTML 文档结构成本已经降了很多——写作者专注内容，结构交给 AI 生成，逻辑上说得通。

这场争论还没有定论。但我觉得值得试试，所以开始把一部分文档从 Markdown 切换成 HTML，看看实际体验怎么样。

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

## 再展开一点：这个插件到底做了什么？

如果只看效果，它只是右键多了一个菜单项；但从实现上看，关键点有几个：

1. **统一入口**：Explorer 文件右键、编辑器 Tab 右键、编辑区上下文菜单都挂同一个命令 `openInIntegratedBrowser.open`，避免多处实现分叉。
2. **调用内置能力**：优先走 VSCode 的 `simpleBrowser.api.open`，在不可用场景再回退 `vscode.open`，保证行为稳定。
3. **可配置扩展名**：通过 `openInIntegratedBrowser.extensions` 控制菜单出现条件，不把文件类型写死在代码里。
4. **本地化文案**：命令标题和菜单文案同时提供中文与英文，避免只适配单语言环境。

这几个点看起来简单，但基本覆盖了一个“小而完整”插件该有的骨架：可用、可配、可维护。

## 配置示例

默认支持扩展名：

```text
html, htm, pdf, xml, xsl, txt, md
```

如果你想只保留自己常用的类型，可以在 `settings.json` 里改成：

```json
{
  "openInIntegratedBrowser.extensions": ["html", "htm", "pdf", "svg", "md"]
}
```

这样右键菜单会更干净，减少无关文件上的干扰。

## 有一点要说实话

如果你从没发布过 VSCode 插件，光是搞清楚发布流程（注册 Azure DevOps 账号、生成 PAT、用 `vsce` 打包上传）可能就要花不少时间——不难，但第一次总要摸索一遍。

我之前发过 [**Communicable-State-Machine-Toolkit**](https://marketplace.visualstudio.com/items?itemName=NEVSTOP-LAB.csm-toolkit)，流程熟，这次直接绕过了这段"学习成本"。所以你如果也想试试用 AI 快速做个插件，最好先把发布这关打通，后面就是纯体力活了。

## 插件信息

![Open in Integrated Browser 插件图标](plugin-icon.png)

**🌐 Open in Integrated Browser**
[![GitHub](https://img.shields.io/badge/GitHub-vsc--open--in--integrated--browser-blue)](https://github.com/NEVSTOP-LAB/vsc-open-in-integrated-browser)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/NEVSTOP-LAB.open-in-integrated-browser?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=NEVSTOP-LAB.open-in-integrated-browser)

本文的主角。右键任意支持的文件，直接在 VSCode 内置 Simple Browser 里打开。支持的扩展名可以自己配，默认有 `html`、`htm`、`pdf`、`xml`、`xsl`、`txt`、`md`。你要是也在试 HTML 文档这条路，装上可以省不少麻烦。

---

有需求、有工具、有点背景知识，20 分钟的事。AI 时代的小工具，基本上就这个节奏。
