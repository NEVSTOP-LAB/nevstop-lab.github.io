---
title: "文档"
description: "NEVSTOP-LAB 站点文档入口，整理组织内仓库 README、社区资源与 CSM 生态导航。"
draft: false
cascade:
  - target:
      path: /docs/guides
    build:
      render: "never"
      list: "never"
  - target:
      path: /docs/guides/**
    build:
      render: "never"
      list: "never"
  - target:
      path: /docs/reference
    build:
      render: "never"
      list: "never"
  - target:
      path: /docs/reference/**
    build:
      render: "never"
      list: "never"
  - target:
      path: /docs/resources
    build:
      render: "never"
      list: "never"
---

NEVSTOP-LAB 站点的文档区域。当前提供以下内容：

## 站内资料

- [仓库 README 列表](/docs/repo-readmes/) —— 自动同步组织内 public 仓库的中文 README，按主题分组浏览。
- [博客](/blog/) —— 团队的实践笔记与经验分享。
- [关于 NEVSTOP-LAB](/about/) —— CSM 生态、社区与 AI-Wiki 机制总览。

## 外部资源

- [GitHub Organization](https://github.com/NEVSTOP-LAB) —— 全部仓库与成员
- [GitHub Discussion](https://github.com/orgs/NEVSTOP-LAB/discussions) —— 问答与讨论
- [NEVSTOP-LAB 知乎专栏](https://www.zhihu.com/column/c_1770421455375126528) —— 组织信息发布窗口
- [CSM 知乎专栏](https://www.zhihu.com/column/c_1681072169147342848) —— 聚焦 CSM 框架的文章与实践
- [CSM-Wiki](https://nevstop-lab.github.io/CSM-Wiki/) —— AI 维护的 CSM 文档站点

如果你希望补充新的文档，可以在 `content/docs/` 下新增 Markdown 文件；自动同步的仓库 README 通过 `.github/workflows/sync-chinese-readmes.yml` 每天 02:00 (UTC) 拉取一次。
