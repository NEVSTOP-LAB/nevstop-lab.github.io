---
title: "两小时造了个 VSCode 插件——AI 时代，小工具不用等"
description: "一次用 HTML 替代 Markdown 做文档的尝试，引发了一个 VSCode 插件的诞生。全程 DeepSeek 出提示词、Copilot 写代码，两小时搞定。"
date: 2026-05-11T19:00:00+08:00
draft: false
contributors:
  - "nevstop-lab"
---

事情要从一个"换个文档格式试试"的念头说起。

## 起因：Markdown 还不够用？

说实话，Markdown 已经够好了。简洁、易读、到处都支持。但当文档需要更复杂的排版——表格套表格、自定义样式、内嵌可交互元素——Markdown 就开始有点力不从心了。所以我最近在折腾一件事：**用 HTML 来写文档**，看看能不能在保留结构化的同时，获得更灵活的表达能力。

然后问题来了。

在 VSCode 里预览 HTML 文件，操作还挺别扭的。你得先打开命令面板，输 `Simple Browser`，再把文件路径手工粘进去……每次改一点，重复一遍。写文档的节奏全被打断了。

我去插件市场搜了一圈，没找到现成的、简单好用的——能右键直接"在内置浏览器里打开"的那种。

好，那就自己做一个。

## 过程：三步走，两小时完工

### 第一步：先和 AI 聊聊

我没有直接开始写代码，而是先开了个 DeepSeek 对话，把需求描述了一遍：

> 我需要一个 VSCode 插件，右键点击 Explorer 里的文件，能把它在 VSCode 内置的 Simple Browser 里打开，支持配置哪些文件类型显示这个菜单项。

然后让它帮我整理成一份给 Copilot 用的提示词。这一步花了大约十几分钟，主要是把需求说清楚，顺便确认一下 VSCode 扩展 API 的关键点——比如 `simpleBrowser.api.open` 这个接口、`when` 条件表达式写法这些。

有没有必要这一步？老实说，如果你对 VSCode 插件开发已经很熟，可能可以跳过。但预先梳理一遍需求，能帮助 AI 生成更准确的代码，少走弯路。

### 第二步：Copilot 一次性出代码

GitHub 仓库建好，把整理好的提示词扔给 **Copilot（claude-opus-4.7，x15）**，然后……等了一会儿。

结果是：**一次跑通，基本功能全到位**。

- 右键 Explorer 文件 → "Open in Integrated Browser" ✅
- 编辑器 Tab 标签也有右键菜单 ✅
- 可配置支持的文件类型（默认支持 `html`、`htm`、`pdf`、`xml`、`md` 等）✅
- 中英文本地化 ✅

生成的代码用 TypeScript 写的，构建走 esbuild，整个工程结构非常标准，该有的都有。

紧接着又跑了两个小 PR 修掉了本地化的小问题、对齐了测试配置，前后加起来不到半小时。

### 第三步：测一测，跑通了

装进 VSCode，右键 `.html` 文件，Simple Browser 弹出来，预览正常，配置修改也生效。

就这样，**从想法到可用插件，大概两个多小时**。

---

## 一个小小的坦白

如果你是第一次写 VSCode 插件，这个过程可能不会这么顺滑。

VSCode 插件发布需要注册 Azure DevOps 账号、生成 PAT、用 `vsce` 工具打包上传——这些环节坑不多，但如果没遇到过，研究清楚也要花时间。

我之前发布过 [**Communicable-State-Machine-Toolkit**](https://marketplace.visualstudio.com/items?itemName=NEVSTOP-LAB.csm-toolkit)——一个用于 LabVIEW CSM 框架开发的 VSCode 工具集——所以这次轮到流程熟悉的人上，一切就顺很多。

说这个不是为了炫耀，而是想说：**AI 能帮你快速实现，但你对领域本身的理解，决定了你能多快验证和收尾**。

---

## 结尾：两个插件都值得一用

如果你也在用 VSCode 开发 LabVIEW 项目或者写 CSM 程序，推荐看一看这两个插件：

**🔧 Communicable-State-Machine-Toolkit**
[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/NEVSTOP-LAB.csm-toolkit)](https://marketplace.visualstudio.com/items?itemName=NEVSTOP-LAB.csm-toolkit)

CSM 专属工具集，包含代码片段、文档跳转、语法高亮等，写 CSM 模块时能省不少力气。

**🌐 Open in Integrated Browser**
[![GitHub](https://img.shields.io/badge/GitHub-vsc--open--in--integrated--browser-blue)](https://github.com/NEVSTOP-LAB/vsc-open-in-integrated-browser)

就是本文的主角。右键任意支持的文件类型，一键在 VSCode 内置 Simple Browser 里打开，再也不用手工复制路径了。支持的文件类型可以自己配置，默认覆盖 `html`、`htm`、`pdf`、`xml`、`xsl`、`txt`、`md`。

---

两小时，一个想法变成了一个能用的工具。AI 时代，小工具真的不用再等了——当然，前提是你得知道自己想要什么。
