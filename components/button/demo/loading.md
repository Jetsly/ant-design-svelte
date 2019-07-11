---
order: 4
title:
  zh-CN: 加载中状态
  en-US: Loading
---

## zh-CN

添加 `loading` 属性即可让按钮处于加载状态，最后两个按钮演示点击后进入加载状态。

## en-US

A loading indicator can be added to a button by setting the `loading` property on the `Button`.

```html
<script>
  import { Button } from 'ant-design-svelte';
  let iconLoading = false
  let btnLoading = false
</script>

<div>
  <Button type="primary" loading>
    Loading
  </Button>
  <Button type="primary" size="small" loading>
    Loading
  </Button>
  <br />
  <Button type="primary" loading={btnLoading} on:click={()=>{btnLoading=true}}>
    Click me!
  </Button>
  <Button type="primary" icon="poweroff" loading={iconLoading}  on:click={()=>{iconLoading=true}}>
    Click me!
  </Button>
  <br />
  <Button shape="circle" loading />
  <Button type="primary" shape="circle" loading />
</div>
```
