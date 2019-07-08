---
order: 0
title: 
  zh-CN: 按钮类型
  en-US: Type
---

## zh-CN

按钮有五种类型：主按钮、次按钮、虚线按钮、危险按钮和链接按钮。主按钮在同一个操作区域最多出现一次。

## en-US

There are `primary` button, `default` button, `dashed` button, `danger` button and `link` button in antd.

```html
<script>
import { Button } from 'ant-design-svelte';
</script>
<div>
  <Button type="primary">Primary</Button>
  <Button>Default</Button>
  <Button type="dashed">Dashed</Button>
  <Button type="danger">Danger</Button>
</div>
```
