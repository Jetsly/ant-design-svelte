---
order: 8
title:
    zh-CN: 多彩文字提示
    en-US: Colorful Tooltip
---

## zh-CN

我们添加了多种预设色彩的文字提示样式，用作不同场景使用。

## en-US

We preset a series of colorful Tooltip styles for use in different situations.

```html
<script>
    import { Button } from 'ant-design-svelte';
    const colors = [
        'pink',
        'red',
        'yellow',
        'orange',
        'cyan',
        'green',
        'blue',
        'purple',
        'geekblue',
        'magenta',
        'volcano',
        'gold',
        'lime',
    ];
    const customColors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
</script>
{#each colors as color}
	  <Button tooltip={{ title:"prompt text",color}}>{color}</Button>
{/each}
{#each customColors as color}
	  <Button tooltip={{ title:"prompt text",color}}>{color}</Button>
{/each}
```
