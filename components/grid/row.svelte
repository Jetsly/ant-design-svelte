<script lang="ts">
  import classNames, { formatStyle } from '../_util/classes';
  import { key } from './_part';
  import { setContext } from 'svelte';

  let className = '';
  export let prefixCls = 'ant-row';
  export let gutter = 0;
  export { className as class };
  export let style = {};

  export let align: 'top' | 'middle' | 'bottom' | 'stretch' = undefined;
  export let justify:
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly' = undefined;
  export let wrap: boolean = undefined;

  $: rowProps = {
    style: formatStyle({
      ...style,
      marginLeft: gutter > 0 ? `${gutter / -2}px` : undefined,
      marginRight: gutter > 0 ? `${gutter / -2}px` : null,
    }),
    class: classNames(className, {
      [`${prefixCls}-no-wrap`]: wrap === false,
      [`${prefixCls}-${justify}`]: justify,
      [`${prefixCls}-${align}`]: align,
      // [`${prefixCls}-rtl`]: direction === 'rtl',
    }),
  };

  setContext(key, {
    gutter,
  });
</script>

<div {...rowProps}>
  <slot />
</div>
