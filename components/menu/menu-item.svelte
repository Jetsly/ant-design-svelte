<script>
  import { getContext } from "svelte";
  import classNames, { formatStyle } from "../_util/classes";
  import warning from "../_util/warning";
  import { store } from "./menu-store.ts";

  let className;
  export { className as class };
  export let prefixCls = "ant-menu-item";
  export let key = "";
  export let disabled = false;
  let classString;
  const { inlineIndent } = getContext("menu");
  function handleClick(e) {
    store.update(val => ({ ...val, selectedKeys: [key] }));
  }
  $: {
    classString = classNames(prefixCls, className, {
      "ant-menu-item-selected": $store.selectedKeys.indexOf(key) > -1
    });
  }
</script>

<li
  class={classString}
  role="menuitem"
  style={formatStyle({ paddingLeft: inlineIndent })}
  on:click={handleClick}>
  <slot />
</li>
