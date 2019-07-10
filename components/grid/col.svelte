<script>
  import classNames from "../_util/classes";
  import { key } from "./_part";
  import { onMount, getContext } from "svelte";

  const { gutter } = getContext(key);

  let className;
  export let prefixCls = "ant-col";
  export { className as class };
  export let style = "";
  export let span;
  export let order;
  export let offset;
  export let push;
  export let pull;
  export let xs;
  export let sm;
  export let md;
  export let lg;
  export let xl;
  export let xxl;

  function getSizeClassObj() {
    let sizeClassObj = {};
    const props = {
      xs,
      sm,
      md,
      lg,
      xl,
      xxl
    };
    ["xs", "sm", "md", "lg", "xl", "xxl"].forEach(size => {
      let sizeProps = {};
      if (typeof props[size] === "number") {
        sizeProps.span = props[size];
      } else if (typeof props[size] === "object") {
        sizeProps = props[size] || {};
      }
      sizeClassObj = {
        ...sizeClassObj,
        [`${prefixCls}-${size}-${sizeProps.span}`]:
          sizeProps.span !== undefined,
        [`${prefixCls}-${size}-order-${sizeProps.order}`]:
          sizeProps.order || sizeProps.order === 0,
        [`${prefixCls}-${size}-offset-${sizeProps.offset}`]:
          sizeProps.offset || sizeProps.offset === 0,
        [`${prefixCls}-${size}-push-${sizeProps.push}`]:
          sizeProps.push || sizeProps.push === 0,
        [`${prefixCls}-${size}-pull-${sizeProps.pull}`]:
          sizeProps.pull || sizeProps.pull === 0
      };
    });
    return sizeClassObj;
  }

  $: colProps = {
    style: `${
      gutter > 0
        ? `padding-left:${gutter / 2}px;padding-right:${gutter / 2}px;`
        : ""
    }${style}`,
    class: classNames(prefixCls, className, {
      [`${prefixCls}-${span}`]: span !== undefined,
      [`${prefixCls}-order-${order}`]: order,
      [`${prefixCls}-offset-${offset}`]: offset,
      [`${prefixCls}-push-${push}`]: push,
      [`${prefixCls}-pull-${pull}`]: pull,
      ...getSizeClassObj()
    })
  };
</script>

<div {...colProps}>
  <slot />
</div>
