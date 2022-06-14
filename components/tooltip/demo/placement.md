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
    import { Button, _util } from 'ant-design-svelte';
    const {formatStyle} = _util;
    const title = 'prompt text';
    const buttonWidth = 70;
</script>
  <div class="demo">
     <div style={formatStyle({ marginLeft: buttonWidth, whiteSpace: 'nowrap' })}>
        <Button tooltip={{placement:"topLeft",title}}>TL</Button>
        <Button tooltip={{placement:"top",title}}>Top</Button>
        <Button tooltip={{placement:"topRight",title}}>TR</Button>
      </div>
      <div style={formatStyle({ width: buttonWidth, float: 'left' })}>
        <Button tooltip={{placement:"leftTop",title}}>LT</Button>
        <Button tooltip={{placement:"left",title}}>Left</Button>
        <Button tooltip={{placement:"leftBottom",title}}>LB</Button>
      </div>
      <div style={formatStyle({ width: buttonWidth, marginLeft: buttonWidth * 4 + 24 })}>
        <Button tooltip={{placement:"rightTop",title}}>RT</Button>
        <Button tooltip={{placement:"right",title}}>Right</Button>
        <Button tooltip={{placement:"rightBottom",title}}>RB</Button>
      </div>
      <div style={formatStyle({ marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' })}>
        <Button tooltip={{placement:"bottomLeft",title}}>BL</Button>
        <Button tooltip={{placement:"bottom",title}}>Bottom</Button>
        <Button tooltip={{placement:"bottomRight",title}}>BR</Button>
      </div>
  </div>
```

```css
.code-box-demo .demo {
    overflow: auto;
}
.code-box-demo .ant-btn {
    margin-right: 8px;
    margin-bottom: 8px;
}
.code-box-demo .ant-btn-rtl {
    margin-right: 0;
    margin-left: 8px;
    margin-bottom: 8px;
}
#components-tooltip-demo-placement .ant-btn {
    width: 70px;
    text-align: center;
    padding: 0;
}
```
