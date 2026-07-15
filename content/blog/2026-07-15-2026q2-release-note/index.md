---
title: "2026 年第二季度（Q2）发布回顾"
description: "NEVSTOP-LAB 组织 2026Q2 发布汇总：CSM 核心框架 v2026.Q2 发布、VSCode 插件模块管理成熟化、CSMScript-Lite 公开、以及多个新仓库与社区生态进展。"
date: 2026-07-15T12:00:00+08:00
draft: false
contributors:
  - "nevstop"
---

2026 年第二季度（4 月 ~ 6 月），NEVSTOP-LAB 组织围绕 CSM 生态持续迭代，在核心框架、开发者工具、社区模块与文档建设上均有重要进展。本文汇总本季度的主要发布与变化。

## CSM 核心框架：v2026.Q2 发布

[Communicable-State-Machine](https://github.com/NEVSTOP-LAB/Communicable-State-Machine) 于 7 月中旬发布 **v2026.Q2** 版本，主题为"CI Pipeline Unification & DX Improvements"。

### Core 改进
- 新增 `Sync Response Only (F)` 可选输入引脚，`CSM - Run Script.vi` 可在同步调用时仅获取响应而不返回其他数据
- 暴露看门狗线程的超时等待时间输入（默认 5000ms），可在创建 CSM 时按需调整
- 修复 `CSM - Convert Argument to Error.vi` 在边界条件下的转换错误
- 菜单入口 VI 统一设为"运行时打开"（Run When Opened），启动时自动隐藏前面板
- CSM 版本号现写入 `.csmlog` 文件头，便于日志溯源

### 调试工具更新
- 修复 `CSM_LAUNCH_INTERFACE_BROWSER` 加载异常
- 更新 Interface Browser UI
- Debug Console 模块信息页细节优化

### 文档与面板
- 链式路由（Chain Mode）的中英文 API 文档语义澄清（[#617](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/pull/617)）
- `CSMLS - Define Loop State(s).vi` 接线警告（中英文）（[#614](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/pull/614)）

### CI 流水线重构
- 将三个分散的 CI workflow 合并为统一的 `CI_Pipeline.yml`，减少维护成本
- 重构测试用例共享模块，简化调试流程

> 完整变更日志请查看 [v2026.Q2 Release](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2026.Q2)。

---

## CSM VSCode 插件：模块管理成熟化

[csm-vsc-extension](https://github.com/NEVSTOP-LAB/csm-vsc-extension) 本季度迎来密集迭代，从初步的模块管理功能演进到成熟的全功能模块管理体验。

### 📅 发布节奏

| 版本 | 日期 | 要点 |
|------|------|------|
| v2026Q1 | 4 月 23 日 | 首次发布到 VSCode Marketplace |
| v2026.5.22 | 5 月 22 日 | 添加模块管理功能 |
| v2026.5.23 | 5 月 23 日 | 非 Git 工作区支持、自动 Star |
| v2026.5.28 | 5 月 29 日 | 自动创建模块仓库 |
| v2026.5.31 | 5 月 31 日 | 功能维护与 Bug 修复 |
| v2026.6.3 | 6 月 3 日 | 🎯 模块管理成熟化、LabVIEW 版本检测与完整国际化 |

### 核心能力

**模块发现与管理**
- 基于 GitHub `topic:csm-modsets` 全局搜索自动发现公开模块
- 登录 GitHub 后纳入私有模块，侧边栏实时显示可见范围
- 启动时优先复用本地缓存，登录后自动网络刷新
- `All / Workspace / Catalog` 三向切换视图，同屏浏览本地模块与在线目录

**LabVIEW 版本检测**
- 模块卡片新增 LV 开发版本徽章（`lv2020` / `lv2020(64bit)`）
- 自动检测 DEV ENVIRONMENT、`.lvproj`、`.lvlib`、`.vi` 四种来源

**模块引入与管理**
- `submodule` / `copy` 两种引入方式，支持互相切换
- 模块锁定机制：已管理模块默认锁定为只读，状态持久化到 YAML
- 首次应用模块时自动初始化本地目录，生成 `csm/csm-modules.yaml`
- 非 Git 工作区全面支持：应用、更新（含 zip 备份）、移除
- 一键创建并发布 GitHub 仓库（未管理文件夹 → private 仓库 + 自动 topics）
- 右键上下文菜单（Open Folder / Open README / Update / Remove）

**国际化**
- 全部用户可见字符串支持中文 / 英文切换
- 覆盖菜单、提示、Hover 内容

> 详细功能说明请阅读博客：[CSM VSCode 插件新增社区模块管理](/blog/2026-06-04-csm-vscode-community-module-management/) 与 [手把手教你使用模块管理功能](/blog/2026-06-08-csm-vscode-module-management-howto/)。

---

## CSMScript-Lite：轻量级脚本引擎公开

[CSMScript-Lite](https://github.com/NEVSTOP-LAB/CSMScript-Lite) 于 4 月正式设为公开仓库（[change_to_public](https://github.com/NEVSTOP-LAB/CSMScript-Lite/releases/tag/change_to_public)），此前已在 v0.3 预览版中完成了脚本引擎的核心能力构建：

- 支持返回值传递与扩展指令
- 锚点式错误处理机制
- 多语言资源字符串管理
- 中英文双语 README

CSMScript-Lite 定位为基于 CSM 的轻量级脚本执行引擎，面向嵌入式软件测试场景，通过脚本描述测试流程，实现可复用、可组合、可回放的测试执行过程。

相关文章：
- [CSMScript-Lite：基于 CSM 框架的轻量级脚本引擎](/blog/2026-04-13-csmscript-lite-engine-intro/)
- [嵌入式软件测试自动化实践：CSMScript-Lite 方案说明](/blog/2026-05-11-csmscript-lite-embedded-test-automation/)

---

## 新增仓库与项目

本季度组织新增了多个公开仓库，覆盖 CSM 生态的各个层面：

### CSM 核心扩展
- **[CSM-MassData-Parameter-Support](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)** — 为 CSM 帧添加大数据参数支持的插件
- **[CSM-LLM-QA](https://github.com/NEVSTOP-LAB/CSM-LLM-QA)** — 通过 LLM+RAG 实现 CSM 相关问题的自动回复基础设施

### CSM 应用模块（csm-modsets）
- **[CSM-TCP-Router-App](https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App)** — TCP 服务端与客户端通信的应用示例
- **[CSM-ModSets-ScheduledCmdWindow](https://github.com/NEVSTOP-LAB/CSM-ModSets-ScheduledCmdWindow)** — 计划命令窗口模块
- **[CSM-Module-Repo-Template](https://github.com/NEVSTOP-LAB/CSM-Module-Repo-Template)** — CSM 模块仓库模板
- **[csm-community-example](https://github.com/NEVSTOP-LAB/csm-community-example)** — 使用 CSM VSCode 插件创建的范例项目

### 开发者工具
- **[vsc-labview-vi-support](https://github.com/NEVSTOP-LAB/vsc-labview-vi-support)** — LabVIEW VI 的 VSCode 支持插件
- **[vsc-open-in-integrated-browser](https://github.com/NEVSTOP-LAB/vsc-open-in-integrated-browser)** — 轻量级 VSCode 扩展，在编辑器标签页上下文菜单添加"在集成浏览器中打开"命令
- **[labview-vi-props-skill](https://github.com/NEVSTOP-LAB/labview-vi-props-skill)** — 读取 LabVIEW VI 属性的 AI Skill
- **[OrgRepoKanban](https://github.com/NEVSTOP-LAB/OrgRepoKanban)** — 组织仓库权限管理工具

---

## 博客与文档

本季度在博客和文档建设上也有持续输出：

| 日期 | 文章 |
|------|------|
| 4 月 13 日 | [CSMScript-Lite：基于 CSM 框架的轻量级脚本引擎](/blog/2026-04-13-csmscript-lite-engine-intro/) |
| 4 月 24 日 | [CSM 的 VSCode 插件支持](/blog/2026-04-24-csm-vscode-plugin-support/) |
| 5 月 11 日 | [嵌入式软件测试自动化实践：CSMScript-Lite 方案说明](/blog/2026-05-11-csmscript-lite-embedded-test-automation/) |
| 5 月 11 日 | [20 分钟搓 VSCode 插件 — AI 时代小工具快速原型实践](/blog/2026-05-11-vsc-open-in-integrated-browser/) |
| 6 月 4 日 | [CSM VSCode 插件新增社区模块管理](/blog/2026-06-04-csm-vscode-community-module-management/) |
| 6 月 8 日 | [手把手教你使用 CSM VSCode 插件模块管理功能](/blog/2026-06-08-csm-vscode-module-management-howto/) |

此外，站点文档系统也持续完善：
- 新增每日同步的 [CSM Modsets 页面](/docs/csm-modsets/)
- 仓库 README 自动同步覆盖范围扩大
- 站点新增 translate.js 多语言前端翻译支持（简体中文 / English / 日本語 / 한국어 / Français / Deutsch / Español / Русский）

---

## 社区与生态

- **组织公开仓库数**：从 Q1 末的约 70 个增长至约 86 个
- **CSM Modsets 生态**：NEVSTOP-LAB 组织内已有 9 个 `csm-modsets` 主题仓库，社区贡献者（nevstop、datadataup、LiXinxing77）累计贡献 4 个模块
- **VSCode 插件**：`csm-vsc-extension` 和 `vsc-open-in-integrated-browser` 均已上架 VSCode Marketplace
- **知乎专栏**：持续同步发布技术文章至 [CSM 知乎专栏](https://www.zhihu.com/column/c_1681072169147342848)

---

## 展望 2026Q3

进入下半年，以下方向将作为重点：

1. **CSM 多语言支持扩展**：将 CSM Framework 能力拓展到 C#、Python 等语言
2. **VSCode 插件持续迭代**：模块管理功能进一步完善，社区反馈驱动的优化
3. **AI-Wiki 建设**：基于 CSM-Wiki 的自动化文档体系持续完善
4. **社区运营**：扩大 CSM 用户与贡献者群体，完善贡献指南与模块发布流程

欢迎通过 [GitHub Discussion](https://github.com/orgs/NEVSTOP-LAB/discussions) 参与讨论，或提交 Issue / PR 为 CSM 生态贡献力量。
