---
category: Components
subtitle: 图标
type: 通用
title: Icon
toc: false
---

语义化的矢量图形。

## 设计师专属

安装 [Kitchen Sketch 插件 💎](https://kitchen.alipay.com)，就可以一键拖拽使用 Ant Design 和 Iconfont 的海量图标，还可以关联自有项目。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 图标类型。遵循图标的命名规范 | string | - |
| style | 设置图标的样式，例如 `fontSize` 和 `color` | CSSProperties | - |
| theme | 图标主题风格。可选实心、描线、双色等主题风格，适用于官方图标 | 'filled' \| 'outlined' \| 'twoTone' | 'outlined' |
| spin | 是否有旋转动画 | boolean | false |
| rotate | 图标旋转角度 | number | - |
| twoToneColor | 仅适用双色图标。设置双色图标的主要颜色 | string (十六进制颜色) | - |
