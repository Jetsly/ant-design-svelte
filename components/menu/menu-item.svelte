<script>
  import { getContext } from "svelte";
  import classNames, { formatStyle } from "../_util/classes";
  import warning from "../_util/warning";

  let className;
  export { className as class };
  export let prefixCls = "ant-menu-item";
  export let key = "";
  export let disabled = false;

  const state = getContext("state");
  const level = getContext("level");
  let classString;
  function handleClick(e) {
    if (disabled) return "";
    state.update(val => ({ ...val, selectedKeys: [key] }))
  }
  $: {
    classString = classNames(prefixCls, className, {
      "ant-menu-item-selected": $state.selectedKeys.indexOf(key) > -1,
      "ant-menu-item-disabled": disabled
    });
  }
</script>

<li
  class={classString}
  role="menuitem"
  style={formatStyle({ paddingLeft: level * $state.inlineIndent })}
  on:click={handleClick}>
  <slot />
</li>
