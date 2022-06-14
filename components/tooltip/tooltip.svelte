<script lang="ts" context="module">
  export type TooltipPlacement =
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
</script>

<script lang="ts">
  import getConfigContext from '../config-provider/context';
  import classNames, { formatStyle } from '../_util/classes';

  const { getPrefixCls, direction } = getConfigContext();

  export { customizePrefixCls as prefixCls };
  export let color: string = '';
  export let overlayClassName: string = '';
  export let placement: TooltipPlacement = 'top';
  export let overlayStyle: string = '';
  export let overlayInnerStyle: string = '';
  export let visible: boolean = false;
  export let zIndex: number = undefined;
  export let onVisibleChange: (visible: boolean) => void = () => void 0;
  export let title: undefined | string = undefined;

  let showArrow = true;
  let customizePrefixCls = '';

  $: prefixCls = getPrefixCls('tooltip', customizePrefixCls);
  $: classes = (() => {
    return classNames(
      prefixCls,
      `${prefixCls}-placement-${placement}`,
      {
        [`${prefixCls}-hidden`]: !visible,
        [`${prefixCls}-rtl`]: direction === 'rtl',
      },
      overlayClassName,
    );
  })();

  $: {
    onVisibleChange(visible);
  }

  $: style = (() => {
    return [overlayStyle, typeof zIndex === 'number' ? formatStyle({ zIndex }) : null]
      .filter(Boolean)
      .join(';');
  })();
</script>

<div class={classes} {style}>
  <div class="{prefixCls}-content">
    {#if showArrow}
      <div class="{prefixCls}-arrow">
        <span class="{prefixCls}-arrow-content" style:--antd-arrow-background-color={color} />
      </div>
    {/if}
    <div
      class="{prefixCls}-inner"
      role="tooltip"
      style={overlayInnerStyle}
      style:background={color}
    >
      {title}
    </div>
  </div>
</div>
