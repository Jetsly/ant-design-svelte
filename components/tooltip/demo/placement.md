---
order: 1
title:
  zh-CN: 位置
  en-US: Placement
---

## zh-CN

位置有 12 个方向。

## en-US

There are 12 placement options available.

```html
<script>
import { Button } from 'ant-design-svelte';
import { formatStyle } from 'ant-design-svelte/_util/classes';
const buttonWidth = 70;
const text = 'prompt text';
</script>
<div class="demo">
  <div style={formatStyle({ marginLeft: buttonWidth, whiteSpace: 'nowrap' })}>
    <Button tooltip={{placement:"topLeft",title:text}}>TL</Button>
    <Button tooltip={{placement:"top",title:text}}>Top</Button>
    <Button tooltip={{placement:"topRight",title:text}}>TR</Button>
  </div>
  <div style={formatStyle({ width: buttonWidth, float: 'left' })}>
    <Button tooltip={{placement:"leftTop",title:text}}>LT</Button>
    <Button tooltip={{placement:"left",title:text}}>Left</Button>
    <Button tooltip={{placement:"leftBottom",title:text}}>LB</Button>
  </div>
  <div style={formatStyle({ width: buttonWidth, marginLeft: buttonWidth * 4 + 24 })}>
    <Button tooltip={{placement:"rightTop",title:text}}>RT</Button>
    <Button tooltip={{placement:"right",title:text}}>Right</Button>
    <Button tooltip={{placement:"rightBottom",title:text}}>RB</Button>
  </div>
  <div style={formatStyle({ marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' })}>
    <Button tooltip={{placement:"bottomLeft",title:text}}>BL</Button>
    <Button tooltip={{placement:"bottom",title:text}}>Bottom</Button>
    <Button tooltip={{placement:"bottomRight",title:text}}>BR</Button>
  </div>
</div>
<style>
.code-box-demo .demo {
  overflow: auto;
}
.code-box-demo .ant-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}
#components-tooltip-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
}
</style>
```
