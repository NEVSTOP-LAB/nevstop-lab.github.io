---
title: 'labview-internal-dialog-watchdog'
linkTitle: 'labview-internal-dialog-watchdog'
description: 'Windows tray watchdog that dismisses blocking LabVIEW Internal Warning/Error dialogs so labview-mcp calls can continue。'
weight: 0
draft: false
repo_name: 'NEVSTOP-LAB/labview-internal-dialog-watchdog'
repo_url: 'https://github.com/NEVSTOP-LAB/labview-internal-dialog-watchdog'
repo_language: 'C#'
repo_stars: 0
repo_group: 'labview-libs'
topics: ['automation', 'dialog', 'dotnet-framework', 'labview', 'labview-mcp', 'tray-icon', 'watchdog', 'windows', 'winforms']
---

> **NEVSTOP-LAB/labview-internal-dialog-watchdog** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/labview-internal-dialog-watchdog) · 语言：`C#` · ⭐ 0
>
> Windows tray watchdog that dismisses blocking LabVIEW Internal Warning/Error dialogs so labview-mcp calls can continue
>
> 主题：`automation` · `dialog` · `dotnet-framework` · `labview` · `labview-mcp` · `tray-icon` · `watchdog` · `windows` · `winforms`

---

> [!NOTE]
> 本工具是 [labview-mcp](https://github.com/NEVSTOP-LAB/labview-mcp) 的配套守护：LabVIEW 被 `Internal Warning` /
> `Internal Error` 对话框挡住时，MCP 调用会一直等不到返回、后续也连不上 LabVIEW。守护进程自动点掉这类对话框，
> 让无人值守的自动化任务（批量 VI 操作、CI、长时间测试）能跑完，不需要有人守在机器前。

# LabVIEW Internal Dialog Watchdog

[中文](./README.md) | [English](./README(en).md)

Windows 托盘守护进程：只监控 LabVIEW 的 **Internal Warning / Internal Error** 对话框，出现后等待 N 秒
（默认 1 秒）自动点击“确定”，让 labview-mcp 等自动化调用继续。**其他对话框一律不管。**

![Internal Warning 示例](https://raw.githubusercontent.com/NEVSTOP-LAB/labview-internal-dialog-watchdog/main/docs/internal-warning.png)

- 单文件 exe，约 40 KB，只依赖 Windows 自带的 .NET Framework 4.8
- 托盘常驻、无主窗口；轮询间隔 300–500ms，静止时 CPU 接近 0
- 只识别窗口类 `#32770` 且文本包含 `Internal Warning` / `Internal Error`（含中文“内部警告/内部错误”）的对话框
- 对话框出现后先等 `clickDelaySeconds`（默认 1 秒），仍存在才点击；期间被手动处理就不动作
- 其他对话框（普通错误、保存/覆盖提示、One Button Dialog 等）完全不处理

## 下载（portable）

从 [Releases](https://github.com/NEVSTOP-LAB/labview-internal-dialog-watchdog/releases) 下载
`LabVIEWInternalDialogWatchdog.exe` 即可，单文件、无安装程序、无需 .NET SDK：

1. 把 exe 放到正常程序目录，例如 `%LOCALAPPDATA%\Programs\LabVIEWInternalDialogWatchdog`；
2. 直接运行（配置与日志在 exe 同目录生成）；需要开机自启用 `install.ps1 -AutoStart` 或托盘菜单。

当前版本：v0.1.0。

## 工作原理

1. 用 `EnumWindows` 枚举顶层窗口，通过窗口 PID 找到目标进程（不依赖在受限环境里会失效的进程枚举）。
2. 只接受窗口类为 `#32770`、可见、在虚拟屏幕内、进程名匹配 `targetProcessNames` 的窗口。
3. 收集对话框文本（标题 + 静态文本），必须命中 `internalDialogMarkers` 才处理。
4. 在对话框内找文本精确匹配“确定/OK/继续/关闭”的按钮（IDOK 例外），找不到就不处理。
5. 首次看到后等待 `clickDelaySeconds` 秒；窗口消失则不做任何动作；仍存在才点击。
6. 点击后确认窗口消失，写日志、弹托盘气泡（可关闭）。

## 构建与安装

需要 Windows 自带的 .NET Framework 4.8（`csc.exe`），不需要 .NET SDK：

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File build.ps1 -Tests
```

安装到正常程序目录（不要放低完整性沙箱目录）：

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File install.ps1 -InstallDir "$env:LOCALAPPDATA\Programs\LabVIEWInternalDialogWatchdog" -Start
```

开机自启：安装时加 `-AutoStart`，或托盘菜单勾选“开机自动启动”。

> [!IMPORTANT]
> 守护进程必须与 LabVIEW 同或更高完整性级别。放在带 Low 完整性标签的目录（如某些沙箱工作区）时，
> 进程是 Low，会看不到/点不动 Medium 的 LabVIEW；安装到 `%LOCALAPPDATA%\Programs` 即可。
> LabVIEW 以管理员运行时，守护也要管理员（UIPI）。

## 配置

默认读取 exe 同目录的 `LabVIEWInternalDialogWatchdog.json`（`--config` 可覆盖）。严格 JSON，加载时容忍整行 `//` 注释；
文件需 UTF-8。托盘菜单“打开配置文件”会生成默认配置。

| 字段 | 默认值 | 说明 |
|---|---|---|
| `targetProcessNames` | `["LabVIEW"]` | 目标进程名（不含 `.exe`） |
| `internalDialogMarkers` | `internal warning/internal error/内部警告/内部错误` | 文本命中才处理 |
| `confirmButtonTexts` | `OK/确定/Continue/继续/Close/关闭` | 视为确认的按钮（精确匹配） |
| `excludeButtonTexts` | `Cancel/取消/Stop/停止/...` | 永不点击的按钮 |
| `clickDelaySeconds` | `1` | 出现后等待多少秒再点；0 立即点 |
| `pollIntervalMs` | `500` | 扫描间隔（100–5000） |
| `maxClickAttempts` | `3` | 同一对话框最多尝试次数 |
| `clickRetryDelayMs` | `900` | 两次尝试间隔 |
| `startPaused` | `false` | 启动即暂停 |
| `showNotifications` | `true` | 点击后弹托盘气泡 |
| `dryRun` | `false` | 只记录不点击 |
| `logDirectory` | `logs` | 日志目录 |

## 命令行

```text
LabVIEWInternalDialogWatchdog.exe                 # 托盘常驻
  --scan [--json]                         # 扫描一次，输出识别到的 Internal Warning
  --watch-seconds <n>                     # 无界面运行 n 秒（测试用）
  --config <path>                         # 指定配置
  --out <path>                            # 扫描/运行结果写入文件
  --dry-run                               # 只记录，不点击
  --exit-after-dismiss                    # 成功关闭一个后立即结束
  --require-dismissal                     # 结束时没有成功关闭则返回 2
  --no-single-instance                    # 跳过单实例检查
  --version
```

> [!NOTE]
> exe 是 GUI 子系统，部分终端/重定向环境下 stdout 不可靠；自动化与排障请用 `--out` 读 UTF-8 结果文件。

## 测试

不需要 LabVIEW 的端到端测试用 `LabVIEWDialogFixture.exe` 模拟：

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File tests\run-tests.ps1
```

覆盖 13 项检查：

- `Internal Warning` 对话框识别与文本匹配
- 出现后约 1 秒（配置值）才点击，日志时间差符合延迟
- 普通对话框不被识别、不被点击
- 非目标进程不处理
- `--dry-run` 不点击
- 配置解析、按钮匹配、延迟上限等单元测试

真实 LabVIEW 验证见 [docs/verification.md](docs/verification.md)。设计思路见 [docs/design.md](docs/design.md)。

## 排障

| 现象 | 排查 |
|---|---|
| 日志只有“守护已启动” | exe 与 LabVIEW 完整性级别不同；从正常程序目录运行，必要时管理员运行 |
| 扫描为空 | 目标进程名不对；对话框不是 `#32770`，或文本没有 Internal Warning/Error |
| 普通错误框没被处理 | 预期行为：本工具只处理 Internal Warning/Error |
| 日志有“点击”但框不消失 | UIPI 拒绝跨级别消息；让守护与 LabVIEW 同权限 |
| 托盘图标不见 | 检查单实例是否已有进程；看 `logs\LabVIEWInternalDialogWatchdog.log` |

## 已知限制

- 只处理窗口类 `#32770`、文本命中 Internal Warning/Error 的对话框；其他错误（如 `error 8 ...`、
  `One Button Dialog`）、保存/覆盖提示、崩溃转储、WER、UAC、其他会话窗口都不处理。
- 必须与 LabVIEW 同或更高完整性；Low 完整性目录里的副本失效。
- 不修复 LabVIEW 内部状态，不重启 LabVIEW；对话框关闭后若服务自身卡死，仍需要重启 LabVIEW。
- 非中英文按钮可能漏检，可通过 `confirmButtonTexts` 补充。
- 轮询延迟约一个扫描周期，实际点击时间 = `clickDelaySeconds` + 最多一个轮询周期。

## License

MIT


