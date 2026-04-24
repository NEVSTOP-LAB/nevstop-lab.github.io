---
title: 'LabVIEW-TimerEngine README'
description: '自动同步自 NEVSTOP-LAB/LabVIEW-TimerEngine 的中文 README'
draft: false
---

> 自动同步来源： [NEVSTOP-LAB/LabVIEW-TimerEngine](https://github.com/NEVSTOP-LAB/LabVIEW-TimerEngine)
> 导入规则：仅根据 README 是否包含中文判断，正文保持原文。

# LabVIEW-TimerEngine

[![Check_Broken_VIs](https://github.com/NEVSTOP-LAB/LabVIEW-TimerEngine/actions/workflows/Check_Broken_VIs.yml/badge.svg)](https://github.com/NEVSTOP-LAB/LabVIEW-TimerEngine/actions/workflows/Check_Broken_VIs.yml)

使用 UserEvent 实现的 Timer 功能。后台使用一个 Timed Loop 进行定时，到达指定时间后，使用 UserEvent 通知订阅 Timer 的模块。

## API

![image](https://user-images.githubusercontent.com/8196752/61720010-9486b080-ad98-11e9-9bbf-f759a0e040fb.png)

 - `Register.vi` : 订阅 Timer
    - `Name`：Timer 名称
    - `TimerPeroid(ms)`： 时间间隔
    - `Start?`: 是否立即启用

 - `Enable.vi` 启用 Timer
    - `Name`：Timer 名称
    - `Enable`：是否启用

 - `Rename.vi` 重命名 Timer
    - `Name`：Timer 名称
    - `NewName`: 新名称

 - `ChangePeroid.vi` 修改 Timer 时间间隔
    - `Name`：Timer 名称
    - `TimePeroid(ms)`: 时间间隔

 - `Status.vi` Timer 状态
    - `Name`：Timer 名称
    - `Exist?`: Timer 是否存在
    - `TimePeroid(ms)`：Timer 时间间隔
    - `Start?`：是否已经启用
    - `EclipsedTime(ms)`：已经经过的时间

 - `unRegister.vi` 取消订阅 Timer
    - `Name`：Timer 名称

## Dependencies

1. OpenG Array Library

