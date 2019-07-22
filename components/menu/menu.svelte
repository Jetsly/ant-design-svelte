<script>
  import { setContext, createEventDispatcher } from "svelte";
  import classNames, { formatStyle } from "../_util/classes";
  import { writable } from "svelte/store";
  import warning from "../_util/warning";

  let className;
  export { className as class };
  export let prefixCls = "ant-menu";
  export let defaultOpenKeys = [];
  export let defaultSelectedKeys = [];
  export let selectedKeys = [];
  export let openKeys = [];
  export let style = {};
  export let theme = "light";
  export let mode = "vertical";
  export let inlineIndent = "24";

  let state = writable({
    inlineIndent,
    mode,
    selectedKeys,
    openKeys
  });
  setContext("state", state);
  setContext("level", 1);

  let classString;
  let dispatch = createEventDispatcher();
  state.subscribe(value => {
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
    state.set({
      inlineIndent,
      mode,
      selectedKeys
    });
  }
</script>

<ul class={classString} role="menu" style={formatStyle(style)}>
  <slot />
</ul>
