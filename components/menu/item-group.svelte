<script>
  import { setContext } from "svelte";
  import classNames, { formatStyle } from "../_util/classes";
  import warning from "../_util/warning";

  let className;
  export { className as class };
  export let prefixCls = "ant-menu-item-group";
  //  ant-menu-submenu ant-menu-submenu-inline ant-menu-submenu-open ant-menu-submenu-selected

  let classString;
  $: {
    classString = classNames(
      prefixCls,
      `${prefixCls}-inline`,
      {
        [`${prefixCls}-root`]: true
      },
      className
    );
  }
</script>

<li class={classString} role="menu">
  <div class={`${prefixCls}-title`}>
    <slot name="title" />
  </div>
  <ul class={`${prefixCls}-list`}>
    <slot />
  </ul>
</li>
