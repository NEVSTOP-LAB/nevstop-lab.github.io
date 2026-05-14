---
title: 'labview-vi-props-skill'
linkTitle: 'labview-vi-props-skill'
description: 'labview-vi-props-skill 中文 README：读取 LabVIEW VI 属性的 Skill。Python · LabVIEW 库与工具。收录项目简介、使用方式与相关资源。'
weight: 0
draft: false
repo_name: 'NEVSTOP-LAB/labview-vi-props-skill'
repo_url: 'https://github.com/NEVSTOP-LAB/labview-vi-props-skill'
repo_language: 'Python'
repo_stars: 0
repo_group: 'labview-libs'
topics: ['ai', 'labview', 'skills']
---

> **NEVSTOP-LAB/labview-vi-props-skill** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/labview-vi-props-skill) · 语言：`Python` · ⭐ 0
>
> 读取 LabVIEW VI 属性的 Skill
>
> 主题：`ai` · `labview` · `skills`

---

# labview-vi-props-skill

这个 Skill 通过“与目标 LabVIEW 安装位数一致”的外部 COM 宿主来读写 VI 属性。
入口脚本仍然是 `scripts/vi_props.py`，但它现在只负责版本识别、安装定位、位数选择
和 worker 调度；真正的 COM 连接与 VI 读写在 `scripts/vi_props_worker.vbs` 中完成。

当前实现的目标不是“尽量连上任意一个 LabVIEW.Application”，而是“尽量一次命中
调用方要求的那个版本/位数”。

- Skill 说明：[`SKILL.md`](./SKILL.md)
- 调度入口：[`scripts/vi_props.py`](./scripts/vi_props.py)
- COM worker：[`scripts/vi_props_worker.vbs`](./scripts/vi_props_worker.vbs)
- Python 依赖：[`requirements.txt`](./requirements.txt)（无第三方运行时依赖）

## 当前行为

- 未显式指定版本时，先从 VI 文件头读取保存版本。
- 从 32 位和 64 位注册表视图定位本机 LabVIEW 安装。
- 目标安装为 x86 时使用 `C:\Windows\SysWOW64\cscript.exe`。
- 目标安装为 x64 时使用 `C:\Windows\System32\cscript.exe`。
- worker 会启动目标 `LabVIEW.exe /Automation`，并核对 `ApplicationDirectory`
	与 `Version`，避免误连到别的版本。
- 当前实现不会回退到无关的活动 / 默认 COM 实例；目标不匹配就直接报错。
- 同版本同时安装 x86 与 x64 时，可用 `--labview-bitness x86|x64` 明确指定。

## 快速开始

```bash
# 自动按 VI 保存版本选择目标 LabVIEW
python scripts/vi_props.py read_description "C:\path\to\test.vi"

# 显式指定版本
python scripts/vi_props.py read_description --labview-version 2017 "C:\path\to\test.vi"

# 同版本双位数并存时，显式指定位数
python scripts/vi_props.py read_description --labview-version 2025 --labview-bitness x64 "C:\path\to\test.vi"
python scripts/vi_props.py read_description --labview-version 2025 --labview-bitness x86 "C:\path\to\test.vi"

# 写入属性
python scripts/vi_props.py write_title "C:\path\to\test.vi" --title "新标题"
python scripts/vi_props.py write_description "C:\path\to\test.vi" --description "新描述"

# 输出版本选择与命中诊断
python scripts/vi_props.py read_description --verbose "C:\path\to\test.vi"
```

## 已验证结果

- 自动识别仓库中的示例 VI，已命中 LabVIEW 2017 x86。
- 显式指定 `--labview-version 2017`，已命中 LabVIEW 2017 x86。
- 显式指定 `--labview-version 2020`，已命中 LabVIEW 2020 x64。
- 显式指定 `--labview-version 2025 --labview-bitness x64`，已命中 LabVIEW 2025 x64。
- 显式指定 `--labview-version 2025 --labview-bitness x86`，已命中 LabVIEW 2025 x86。
- 未指定 `--labview-bitness` 且同版本双架构并存时，当前默认优先当前运行环境架构；
	在本机的 64 位 Python 环境下，`2025` 默认命中 x64。

更多设计细节、Python API 和 worker 行为说明见 [`SKILL.md`](./SKILL.md)。

