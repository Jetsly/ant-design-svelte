---
order: 3
title:
    zh-CN: 自动调整位置
    en-US: Adjust placement automatically
debug: true
---

## zh-CN

气泡框不可见时自动调整位置

## en-US

Adjust placement automatically when tooltip is invisible.

```html
<script>
    import { Tooltip, Button } from 'ant-design-svelte';
    function getPopupContainer(trigger) {
        return trigger.parentElement;
    }
</script>
<Tooltip placement="left" title="Prompt Text" getPopupContainer="{getPopupContainer}">
    <Button>Adjust automatically / 自动调整</Button>
</Tooltip>
<br />
<Tooltip
    placement="left"
    title="Prompt Text"
    getPopupContainer="{getPopupContainer}"
    autoAdjustOverflow="{false}"
>
    <Button>Ignore / 不处理</Button>
</Tooltip>
```
