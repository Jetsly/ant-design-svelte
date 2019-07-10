<script>
  import classNames from "../_util/classes";
  import { key } from "./_part";
  import { onMount, setContext } from "svelte";

  let className;
  export let prefixCls = "ant-row";
  export let gutter = 0;
  export { className as class };
  export let style = "";
  export let type;
  export let align;
  export let justify;
  $: rowProps = {
    style: `${
      gutter > 0
        ? `margin-left:${gutter / -2}px;margin-right:${gutter / -2}px;`
        : ""
    }${style}`,
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
