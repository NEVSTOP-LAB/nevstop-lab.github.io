---
title: "2026Q2 Release: BUG修复, 接口、文档维护, 测试用例/流水线改进"
description: "CSM 2026Q2 版本更新说明，涵盖 CSM Core、CSM-MassData-Parameter-Support、CSM DAQ Example、CSM TCP Router 等仓库的主要变更。"
date: 2026-07-15T12:00:00+08:00
draft: false
contributors:
  - "nevstop"
---

## [CSM Core](https://github.com/NEVSTOP-LAB/Communicable-State-Machine) — [v2026.Q2：CI 流水线统一与开发体验改进](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2026.Q2)

### Core
- [更新] [#606](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/606) 为 `CSM - Run Script.vi` 添加 "Sync Response Only (F)" 可选输入引脚
- [更新] [#607](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/607) 暴露 CSM 看门狗线程的超时等待时间输入（默认 5000ms）
- [修复] [#620](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/620) 修复 `CSM - Convert Argument to Error.vi` 在边界条件下的转换错误
- [更新] [#611](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/611) 菜单入口 VI 统一设为"运行时打开"，启动时自动隐藏前面板
- [更新] [#612](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/612) 将 CSM 版本号写入 `.csmlog` 文件头

### Debug Tools
- [修复] 修复 CSM_LAUNCH_INTERFACE_BROWSER 加载异常
- [修复] Debug Console 模块信息页细节修复
- [更新] 更新 Interface Browser.vi

### Doc/Palette
- [文档] [#617](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/pull/617) 澄清链式路由语义的中英文 API 文档
- [文档] [#614](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/pull/614) 为 `CSMLS - Define Loop State(s).vi` 帮助文档添加接线顺序警告

### CI Pipeline/testcases
- [重构] 将三个分散的 CI 工作流合并为统一的 `CI_Pipeline.yml`
- [更新] 重构测试用例共享模块，简化调试流程

## [CSM-MassData-Parameter-Support](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support) — [v2026.Q2：小幅度更新](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support/releases/tag/v2026.Q2)

- [文档] 添加 MassData Support Addon 中英文文档
- [修复] [#43](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support/issues/43) 修复 yml 路径问题：改用反斜杠及 NEVSTOP-LAB/lvCICD@main

## [CSM DAQ Example](https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging) — [v2026.Q2：Bug 修复与文档更新](https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging/releases/tag/v2026.Q2)

- [修复] [#44](https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging/issues/44) 修复点击"OK"按钮后声卡采集模块未隐藏的问题
- [修复] [#45](https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging/issues/45) 修复构建后的应用程序在显示设置对话框后无法退出的问题

## [CSM TCP Router](https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App) — [v2026.Q2：小幅度更新](https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App/releases/tag/v2026.Q2)

- Example 名称修改 / 文档补全 / 内部结构梳理

## CSM Keynotes Collection

[csm-keynotes-collection](https://github.com/NEVSTOP-LAB/csm-keynotes-collection)

- [KivenJia (Kevin)](https://github.com/KivenJia) 收录并更新了 **从问题到实现——CSM 在典型场景中的落地实践 @北京LV爱好者聚会** 讲演资料（2026.05.23）

