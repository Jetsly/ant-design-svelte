---
category: Components
type: General
title: Button
---

To trigger an operation.

## When To Use

A button means an operation (or a series of operations). Clicking a button will trigger corresponding business logic.

## API

To get a customized button, just set `type`/`shape`/`size`/`loading`/`disabled`.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| disabled | disabled state of button | boolean | `false` |
| ghost | make background transparent and invert text and border colors, added in 2.7 | boolean | `false` |
| href | redirect url of link button | string | - |
| htmlType | set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) | string | `button` |
| icon | set the icon of button, see: Icon component | string | - |
| loading | set the loading status of button | boolean \| { delay: number } | `false` |
| shape | can be set to `circle`, `round` or omitted | string | - |
| size | can be set to `small` `large` or omitted | string | `default` |
| target | same as target attribute of a, works when href is specified | string | - |
| type | can be set to `primary` `ghost` `dashed` `danger` `link`(added in 3.17) or omitted (meaning `default`) | string | `default` |
| on:click | set the handler to handle `click` event | (event) => void | - |
| block | option to fit button width to its parent width | boolean | `false` |

It accepts all props which native button support.


<style>
:global([id^=components-button-demo-] .ant-btn) {
  margin-right: 8px;
  margin-bottom: 12px;
}
:global([id^=components-button-demo-] .ant-btn-group > .ant-btn),
:global([id^=components-button-demo-] .ant-btn-group > span > .ant-btn) {
  margin-right: 0;
}
</style>
