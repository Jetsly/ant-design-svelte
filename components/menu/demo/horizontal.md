---
order: 0
title:
  zh-CN: 顶部导航
  en-US: Top Navigation
---

## zh-CN

水平的顶部导航菜单。

## en-US

Horizontal top navigation menu.

```html
<script>
  import { Menu, Icon } from 'ant-design-svelte';
  const { SubMenu } = Menu;
  let selectedKeys = ['mail'];
  function handleClick({detail}) {
    selectedKeys = detail.selectedKeys
  }
</script>
<Menu on:select={handleClick} {selectedKeys} mode="horizontal">
  <Menu.Item key="mail">
    <Icon type="mail" />
    Navigation One
  </Menu.Item>
  <Menu.Item key="app" disabled>
    <Icon type="appstore" />
    Navigation Two
  </Menu.Item>
  <SubMenu>
    <span slot="title" class="submenu-title-wrapper">
      <Icon type="setting" />
      Navigation Three - Submenu
    </span>
    <Menu.ItemGroup title="Item 1">
      <Menu.Item key="setting:1">Option 1</Menu.Item>
      <Menu.Item key="setting:2">Option 2</Menu.Item>
    </Menu.ItemGroup>
    <Menu.ItemGroup title="Item 2">
      <Menu.Item key="setting:3">Option 3</Menu.Item>
      <Menu.Item key="setting:4">Option 4</Menu.Item>
    </Menu.ItemGroup>
  </SubMenu>
  <Menu.Item key="alipay">
    <a href="https://ant-svelte.ddot.ink" target="_blank" rel="noopener noreferrer">
      Navigation Four - Link
    </a>
  </Menu.Item>
</Menu>
```
