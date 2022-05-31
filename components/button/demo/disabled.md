---
order: 3
title:
    zh-CN: 不可用状态
    en-US: Disabled
---

## zh-CN

添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。

## en-US

To mark a Button as disabled, add the `disabled` property to the `Button`.

```html
<script>
    import { Button } from 'ant-design-svelte';
</script>
<div>
    <Button type="primary">Primary</Button>
    <Button type="primary" disabled>Primary(disabled)</Button>
    <br />
    <Button>Default</Button>
    <Button disabled>Default(disabled)</Button>
    <br />
    <Button type="dashed">Dashed</Button>
    <Button type="dashed" disabled>Dashed(disabled)</Button>
    <br />
    <Button type="text">Text</Button>
    <Button type="text" disabled>Text(disabled)</Button>
    <br />
    <Button type="link">Link</Button>
    <Button type="link" disabled>Link(disabled)</Button>
    <br />
    <Button danger>Danger Default</Button>
    <Button danger disabled>Danger Default(disabled)</Button>
    <br />
    <Button danger type="text">Danger Text</Button>
    <Button danger type="text" disabled>Danger Text(disabled)</Button>
    <br />
    <Button type="link" danger>Danger Link</Button>
    <Button type="link" danger disabled>Danger Link(disabled)</Button>
    <div class="site-button-ghost-wrapper">
        <Button ghost>Ghost</Button>
        <Button ghost disabled>Ghost(disabled)</Button>
    </div>
</div>
```

```css
.site-button-ghost-wrapper {
    padding: 8px 8px 0 8px;
    background: rgb(190, 200, 200);
}
```
