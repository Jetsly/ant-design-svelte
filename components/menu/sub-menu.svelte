<script>
  import { setContext, getContext } from "svelte";
  import classNames, { formatStyle } from "../_util/classes";
  import { store } from "./menu-store.ts";
  import warning from "../_util/warning";

  let className;
  export { className as class };
  export let prefixCls = "ant-menu-submenu";
  export let key = "";
  export let disabled = false;
  //  ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open ant-menu-submenu-selected

  let classString;

  const { inlineIndent } = getContext("menu");
  setContext("menu", {
    inlineIndent: inlineIndent * 2
  });
  $: {
    classString = classNames(
      prefixCls,
      `${prefixCls}-${$store.mode}`,
      {
        [`${prefixCls}-root`]: true
      },
      className
    );
  }
</script>

<li class={classString} role="menuitem">
  <div
    class={`${prefixCls}-title`}
    style={formatStyle({ paddingLeft: inlineIndent })}>
    <slot name="title" />
    <i class="ant-menu-submenu-arrow" />
  </div>
  <ul class="ant-menu ant-menu-sub ant-menu-inline">
    <slot />
  </ul>
</li>
