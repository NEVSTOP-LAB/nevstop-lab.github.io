---
title: 'CSM-Modsets-WaveformDisplay'
linkTitle: 'CSM-Modsets-WaveformDisplay'
description: 'CSM-Modsets-WaveformDisplay 中文 README：CSM 模块: 显示 Waveform。LabVIEW · CSM 应用与示例。收录项目简介、使用方式与相关资源。'
weight: -6
draft: false
repo_name: 'NEVSTOP-LAB/CSM-Modsets-WaveformDisplay'
repo_url: 'https://github.com/NEVSTOP-LAB/CSM-Modsets-WaveformDisplay'
repo_language: 'LabVIEW'
repo_stars: 6
repo_group: 'csm-apps'
topics: ['csm-modsets', 'labview-csm']
---

> **NEVSTOP-LAB/CSM-Modsets-WaveformDisplay** · 来源：[GitHub](https://github.com/NEVSTOP-LAB/CSM-Modsets-WaveformDisplay) · 语言：`LabVIEW` · ⭐ 6
>
> CSM 模块: 显示 Waveform
>
> 主题：`csm-modsets` · `labview-csm`

---

# CSM-Modsets-WaveformDisplay

基于 [CSM（可通信状态机）](https://nevstop-lab.github.io/CSM-Wiki/) 框架的波形显示模块组，用于在 LabVIEW 前面板中渲染和展示波形数据。

This repository contains CSM-based modules for rendering and displaying waveform data on LabVIEW front panels.

---

## 模块列表

| 模块 | 所属模块组 | 功能说明 |
| --- | --- | --- |
| [WaveformDisplay](./WaveformDisplay.md) | CSM-WaveformDisplay.lvlib | 通用波形显示，支持多通道波形渲染 |
| [WaveformDisplay2](./WaveformDisplay2.md) | CSM-WaveformDisplay.lvlib | WaveformDisplay 改进版本 |
| [WaveformDisplay(SingleRef)](<./WaveformDisplay(SingleRef).md>) | CSM-WaveformDisplay.lvlib | 单引用模式，针对单路波形信号优化 |
| [WaveformDisplay(Multi-Refs)](<./WaveformDisplay(Multi-Refs).md>) | CSM-WaveformDisplay.lvlib | 多引用模式，支持多路波形同时显示 |

---

## 许可

本项目采用 Apache License 2.0 发布。

---

- _完整 CSM 语法参考：<https://github.com/NEVSTOP-LAB/Communicable-State-Machine/blob/main/.doc/Syntax.md>_
- _CSM Wiki：<https://nevstop-lab.github.io/CSM-Wiki/>_

