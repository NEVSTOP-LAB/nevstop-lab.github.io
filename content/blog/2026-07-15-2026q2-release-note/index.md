---
title: "2026Q2 Release: BUG修复, 接口、文档维护, 测试用例/流水线改进"
description: "CSM 2026Q2 版本更新说明，涵盖 CSM Core、CSM-MassData-Parameter-Support、CSM DAQ Example、CSM TCP Router 等仓库的主要变更。"
date: 2026-07-15T12:00:00+08:00
draft: false
contributors:
  - "nevstop"
---

> 【2026Q2 精简公告】CSM 2026Q2 已发布并推送至 VIPM。本期重点包括：Core 框架接口与文档维护、MassData 文档与 CI 路径修复、DAQ Example 的 Bug 修复、TCP Router 结构梳理，以及 CI 流水线统一。建议从 v2026.Q1 升级并重点回归脚本解析与看门狗配置。

2026 年 7 月的 CSM 2026Q2 更新已经推送到 VIPM。如果你觉得 CSM 对你有帮助，请在 GitHub / Gitee 上 star 对应的仓库！也欢迎有经验的 LabVIEW 高手参与到 CSM 的开发中来。

- GitHub: https://github.com/NEVSTOP-LAB
- Gitee: https://gitee.com/NEVSTOP-LAB
- VIPM: https://www.vipm.io

## 版本亮点

- CSM Core 根据用户反馈, 对一些接口添加了可选输入引脚, 并修复了若干已知问题。
- MassData 补充了完整的中英文文档。
- DAQ Example 修复了两个用户反馈的界面交互 Bug。
- TCP Router 完成了示例名称规范、文档补全与内部结构梳理。
- KivenJia (Kevin) 收录了北京 LV 爱好者聚会的 CSM 落地实践讲演资料。

## 按仓库变更

### 1. Communicable-State-Machine

**功能改动（重点）**

- [更新] [#606](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/606) 为 `CSM - Run Script.vi` 添加 "Sync Response Only (F)" 可选输入引脚
- [更新] [#607](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/607) 暴露 CSM 看门狗线程的超时等待时间输入（默认 5000ms）
- [修复] [#620](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/620) 修复 `CSM - Convert Argument to Error.vi` 在边界条件下的转换错误
- [更新] [#611](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/611) 菜单入口 VI 统一设为"运行时打开"，启动时自动隐藏前面板
- [更新] [#612](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/issues/612) 将 CSM 版本号写入 `.csmlog` 文件头
- [修复] 修复 CSM_LAUNCH_INTERFACE_BROWSER 加载异常
- [修复] Debug Console 模块信息页细节修复
- [更新] 更新 Interface Browser.vi
- [文档] [#617](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/pull/617) 澄清链式路由语义的中英文 API 文档
- [文档] [#614](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/pull/614) 为 `CSMLS - Define Loop State(s).vi` 帮助文档添加接线顺序警告
- [重构] 将三个分散的 CI 工作流合并为统一的 `CI_Pipeline.yml`
- [更新] 重构测试用例共享模块，简化调试流程

**用户收益**

- 看门狗超时时间可配置后，在多模块协同场景下可根据模块响应时间灵活调整，减少误报。
- Sync Response Only 选项可减少同步调用中不必要的数据传输，提升脚本执行效率。
- 调试工具的稳定性改善，Interface Browser 加载异常修复后，模块接口查阅不再中断。
- CI 流水线统一后，PR 验证流程更简洁，测试用例维护成本降低。

### 2. CSM-MassData-Parameter-Support

**功能改动（重点）**

- [文档] 添加 MassData Support Addon 中英文文档
- [修复] [#43](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support/issues/43) 修复 yml 路径问题：改用反斜杠及 NEVSTOP-LAB/lvCICD@main

### 3. CSM DAQ Example

**功能改动（重点）**

- [修复] [#44](https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging/issues/44) 修复点击"OK"按钮后声卡采集模块未隐藏的问题
- [修复] [#45](https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging/issues/45) 修复构建后的应用程序在显示设置对话框后无法退出的问题

### 4. CSM TCP Router

**功能改动（重点）**

- Example 名称修改 / 文档补全 / 内部结构梳理

### 5. CSM Keynotes Collection

- [KivenJia (Kevin)](https://github.com/KivenJia) 收录并更新了 **从问题到实现——CSM 在典型场景中的落地实践 @北京LV爱好者聚会** 讲演资料（2026.05.23）

## 完整变更来源

- Communicable-State-Machine: https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases/tag/v2026.Q2
- CSM-MassData-Parameter-Support: https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support/releases/tag/v2026.Q2
- CSM-Continuous-Meausrement-and-Logging: https://github.com/NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging/releases/tag/v2026.Q2
- CSM-TCP-Router-App: https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App/releases/tag/v2026.Q2

## 结尾

欢迎大家升级到 2026Q2 并反馈实际使用体验。你可以通过 GitHub / Gitee 提交 issue、讨论改进方向，或直接参与 CSM 生态共建。

