---
order: 2
title:
    zh-CN: 箭头指向
    en-US: Arrow pointing at the center
---

## zh-CN

设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。

## en-US

By specifying `arrowPointAtCenter` prop, the arrow will point to the center of the target element.

```html
<script>
    import { Tooltip, Button } from 'ant-design-svelte';
</script>
<div>
    <Tooltip placement="topLeft" title="Prompt Text">
        <Button>Align edge / 边缘对齐</Button>
    </Tooltip>
    <Tooltip placement="topLeft" title="Prompt Text" arrowPointAtCenter>
        <Button>Arrow points to center / 箭头指向中心</Button>
    </Tooltip>
</div>
```
