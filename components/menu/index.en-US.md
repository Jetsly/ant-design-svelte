---
category: Components
cols: 1
type: Navigation
title: Menu
---

Menu list of Navigation.

## When To Use

Navigation menu is important for a website, it helps users jump from one site section to another quickly. Mostly, it includes top navigation and side navigation. Top navigation provides all the category and functions of the website. Side navigation provides the Multi-level structure of the website.

More layouts with navigation: [layout](/components/layout).

## API


### Menu

| Param | Description | Type | Default value |
| --- | --- | --- | --- |
| defaultOpenKeys | array with the keys of default opened sub menus | string\[] |  |
| defaultSelectedKeys | array with the keys of default selected menu items | string\[] |  |
| inlineCollapsed | specifies the collapsed status when menu is inline mode | boolean | - |
| inlineIndent | indent px of inline menu item on each level | number | 24 |
| mode | type of the menu; `vertical`, `horizontal`, and `inline` modes are supported | string: `vertical` \| `horizontal` \| `inline` | `vertical` |
| openKeys | array with the keys of currently opened sub menus | string\[] |  |
| selectedKeys | array with the keys of currently selected menu items | string\[] |  |
| style | style of the root node | object |  |
| theme | color theme of the menu | string: `light` `dark` | `light` |
| onSelect | callback executed when a menu item is selected | function({ item, key, keyPath, selectedKeys, domEvent }) | none |

### Menu.Item

| Param    | Description                          | Type    | Default value |
| -------- | ------------------------------------ | ------- | ------------- |
| disabled | whether menu item is disabled or not | boolean | false         |
| key      | unique id of the menu item           | string  |               |
| title    | set display title for collapsed item | slot  |               |

### Menu.SubMenu

| Param | Description | Type | Default value |
| --- | --- | --- | --- |
| children | sub menus or sub menu items | Array&lt;MenuItem\|SubMenu> |  |
| disabled | whether sub menu is disabled or not | boolean | false |
| key | unique id of the sub menu | string |  |
| title | title of the sub menu | slot |  |
| on:title-click | callback executed when the sub menu title is clicked | function({ key, domEvent }) |  |

### Menu.ItemGroup

| Param    | Description        | Type              | Default value |
| -------- | ------------------ | ----------------- | ------------- |
| children | sub menu items     | MenuItem\[]       |               |
| title    | title of the group | slot |               |

### Menu.Divider

Divider line in between menu items, only used in vertical popup Menu or Dropdown Menu.
