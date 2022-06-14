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
    import { Button } from 'ant-design-svelte';
</script>
<div>
<Button tooltip={{placement:"topLeft",title:"Prompt Text"}}>Align edge / 边缘对齐</Button>
<Button tooltip={{placement:"topLeft",title:"Prompt Text",arrowPointAtCenter:true}}>Arrow points to center / 箭头指向中心</Button>
</div>
```
