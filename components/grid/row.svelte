<script>
  import classNames, { formatStyle } from "../_util/classes";
  import { key } from "./_part";
  import { onMount, setContext } from "svelte";

  let className;
  export let prefixCls = "ant-row";
  export let gutter = 0;
  export { className as class };
  export let style = {};
  export let type;
  export let align;
  export let justify;
  $: rowProps = {
    style: formatStyle({
      ...style,
      marginLeft: gutter > 0 ? `${gutter / -2}px` : undefined,
      marginRight: gutter > 0 ? `${gutter / -2}px` : null
    }),
    class: classNames(className, {
      [prefixCls]: !type,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${type}-${justify}`]: type && justify,
      [`${prefixCls}-${type}-${align}`]: type && align
    })
  };

  setContext(key, {
    gutter
  });
</script>

<div {...rowProps}>
  <slot />
</div>
