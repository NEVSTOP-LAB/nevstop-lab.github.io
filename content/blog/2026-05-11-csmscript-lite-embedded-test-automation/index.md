---
title: "嵌入式软件测试自动化实践：CSMScript-Lite 方案说明"
description: "面向嵌入式软件测试场景，介绍基于 CSM 与 CSMScript-Lite 的自动化测试分层设计与脚本能力。"
date: 2026-05-11T16:00:00+08:00
draft: false
contributors:
  - "nevstop-lab"
---

> 本文整理自知乎回答，并按站点文档风格进行结构化排版。
> 原文链接：https://www.zhihu.com/question/52332368/answer/2027321067560088493

在嵌入式软件测试中，典型痛点通常包括：硬件接口多、测试步骤长、重复回归成本高、以及测试逻辑与业务逻辑耦合过深。针对这类问题，CSMScript-Lite 提供了一条较轻量的自动化路径：以 CSM 模块化通信为基础，通过脚本描述测试流程，实现可复用、可组合、可回放的测试执行过程。

## 典型分层思路

结合原回答给出的实践，自动化测试可按以下分层组织：

1. 硬件抽象层：封装仪器与接口操作。
2. 测量抽象层：实现数据采集、计算与判定。
3. 交互层：通过 LabVIEW 界面支持手动调试与局部验证。
4. 脚本层：使用 CSMScript 组织端到端自动化测试流程。

这种分层方式的核心价值是把「模块能力」和「测试流程」解耦：模块专注提供稳定接口，脚本专注编排执行逻辑。

## CSMScript-Lite 项目组成

CSMScript-Lite 是一个基于 CSM 的轻量脚本执行引擎，也可作为 CSM 能力展示的实践样例。项目通常包括：

- CSMScript-Lite Library：脚本解析与执行核心。
- Engine：负责脚本运行、状态推进与结果管理。
- UI（ExecutionView）：用于脚本管理、执行控制和结果查看。
- App：示例应用，演示脚本驱动测试的完整流程。
- 示例工程：展示与其他 CSM 模块协同工作的方式。

参考链接：

- CSM 框架：https://github.com/NEVSTOP-LAB/Communicable-State-Machine
- CSMScript-Lite：https://github.com/NEVSTOP-LAB/CSMScript-Lite
- CSM 主题聚合：https://github.com/topics/labview-csm

## 运行依赖

- LabVIEW 2020 及以上版本
- Communicable State Machine Framework（2026Q1）
- 常见扩展能力：
  - CSM API String Arguments Support
  - CSM MassData Parameter Support
  - CSM INI Static Variable Support

## 功能要点

### 1) 脚本执行

CSMScript-Lite 支持常见 CSM 命令形态，包括同步消息、异步消息与广播订阅模型，便于将已有模块直接接入自动化流程。

### 2) 返回值传递

可通过 `=> 变量名` 语法保存某条指令返回值，并在后续指令中引用：

```text
message1 >> arguments -@ module1 => returnValueVar
message2 >> ${returnValueVar} -@ module2
```

这让脚本具备「前一步输出驱动后一步输入」的链式表达能力。

### 3) 扩充指令

除标准 CSM 指令外，CSMScript 还支持扩充指令（大小写不敏感）：

- `GOTO`：跳转到指定锚点。
- `AUTO_ERROR_HANDLE_ENABLE`：启用或关闭自动错误处理。
- `AUTO_ERROR_HANDLE_ANCHOR`：设置错误跳转锚点（默认 `<cleanup>`）。
- `WAIT` / `Sleep`：支持混合时间表达式，如 min/s/ms。
- `WAIT(s)` / `WAIT(ms)`：按秒或毫秒精确等待。

示例：

```text
wait >> 1min 20s 500ms
wait(ms) >> 100
wait(s) >> 1.5
```

### 4) 锚点与错误跳转

可通过锚点划分脚本阶段（如 `<setup>`、`<main>`、`<cleanup>`），并结合条件跳转构建鲁棒流程。

```text
AUTO_ERROR_HANDLE_ENABLE >> TRUE
AUTO_ERROR_HANDLE_ANCHOR >> error_handler

<setup>
initialize >> daq1 -@ ai ?? goto >> <cleanup>

<main>
configure >> Onboard Clock;10,-10,RSE -@ ai
start -@ ai
acquire >> Channel:ch0;Num:1000 -@ ai

<error_handler>
stop -@ ai

<cleanup>
close -@ ai
```

这种写法可以让异常路径与主流程并行定义，显著降低测试脚本在复杂场景下的维护成本。

## 在嵌入式测试中的落地建议

1. 先把设备控制、数据采集、结果判定拆成独立 CSM 模块，再引入脚本编排。
2. 先沉淀一批可重复执行的典型用例，再扩大到全量回归。
3. 明确约定脚本中的锚点命名和错误处理策略，保证团队协作一致性。
4. 将脚本文件纳入版本管理，让测试流程可追溯、可评审。

## 小结

CSMScript-Lite 的意义不只是「把手工测试改成自动执行」，更重要的是把测试流程变成结构化资产：可复用、可组合、可演进。对于需要长期维护的嵌入式项目，这种能力往往比单次测试效率提升更有价值。

如果你正在规划下一阶段能力，也可以思考：在 full 版本中，还希望增加哪些流程控制、断言和报告能力？这会直接决定自动化体系的上限。
