<script>
  import { setContext, getContext } from "svelte";
  import classNames, { formatStyle } from "../_util/classes";
  import warning from "../_util/warning";

  let className;
  export { className as class };
  export let prefixCls = "ant-menu-submenu";
  export let key = "";
  export let disabled = false;
  export let title = false;

  const state = getContext("state");
  const level = getContext("level");
  setContext("level", level + 1);

  let classString;
  let subClassString;
  let open = false;
  $: {
    classString = classNames(
      prefixCls,
      `${prefixCls}-${$state.mode}`,
      {
        [`${prefixCls}-selected`]: $state.selectedKeys.indexOf(key) > -1,
        // [`${prefixCls}-root`]: true,
        [`${prefixCls}-open`]: open
      },
      className
    );
    subClassString = classNames(
      "ant-menu",
      "ant-menu-sub",
      `ant-menu-${$state.mode}`,
      {
        "ant-menu-hidden": !open
      }
    );
  }
</script>

<li
  class={classString}
  role="menuitem"
  on:click={event => {
    console.log(1);
    open = !open;
  }}>
  <div
    class={`${prefixCls}-title`}
    style={formatStyle({ paddingLeft: level * $state.inlineIndent })}>
    <slot name="title">{title}</slot>
    <i class="ant-menu-submenu-arrow" />
  </div>
  {#if $state.mode !== 'horizontal'}
    <ul class={subClassString}>
      <slot />
    </ul>
  {/if}
</li>
