<script>
  import { setContext, createEventDispatcher } from "svelte";
  import classNames, { formatStyle } from "../_util/classes";
  import warning from "../_util/warning";
  import { store } from "./menu-store";

  let className;
  export { className as class };
  export let prefixCls = "ant-menu";
  export let defaultOpenKeys = [];
  export let defaultSelectedKeys = [];
  export let selectedKeys = [];
  export let style = {};
  export let theme = "light";
  export let mode = "vertical";
  export let inlineIndent = "24";

  setContext("menu", {
    inlineIndent
  });

  let classString;
  let dispatch = createEventDispatcher();
  store.subscribe(value => {
    if (
      value.selectedKeys.filter(key => selectedKeys.indexOf(key) === -1).length
    ) {
      dispatch("select", { selectedKeys: value.selectedKeys });
    }
  });
  $: {
    classString = classNames(
      prefixCls,
      `${prefixCls}-${mode}`,
      `${prefixCls}-${theme}`,
      `${prefixCls}-root`,
      className
    );
    store.set({ selectedKeys, mode });
  }
</script>

<ul class={classString} role="menu" style={formatStyle(style)}>
  <slot />
</ul>
