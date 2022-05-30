<script lang="ts">
  import { onMount } from 'svelte';
  import classNames, { formatStyle } from '../_util/classes';
  import ResponsiveObserve, {
    responsiveArray,
    type Breakpoint,
    type ScreenMap,
  } from '../_util/responsiveObserve';
  import { detectFlexGapSupported } from '../_util/styleChecker';
  import getConfigContext from '../config-provider/context';
  import { setRowContext } from './rowContext';

  export { className as class };
  export { customizePrefixCls as prefixCls };
  export let gutter = 0;
  export let style = undefined;

  export let align: 'top' | 'middle' | 'bottom' | 'stretch' = undefined;
  export let justify:
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly' = undefined;
  export let wrap: boolean = undefined;

  let className = '';
  let customizePrefixCls = '';
  let screens: ScreenMap = {
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    xxl: true,
  };
  let gutters: [number | undefined, number | undefined] = [undefined, undefined];

  const { getPrefixCls, direction } = getConfigContext();

  let rowStyle: Record<string, string | number> = {};
  const supportFlexGap = detectFlexGapSupported();

  const rowContextState = setRowContext({
    gutter: gutters,
    wrap,
    supportFlexGap,
  });

  onMount(() => {
    const token = ResponsiveObserve.subscribe(screen => {
      if (
        (!Array.isArray(gutter) && typeof gutter === 'object') ||
        (Array.isArray(gutter) && (typeof gutter[0] === 'object' || typeof gutter[1] === 'object'))
      ) {
        screens = screen;
      }
    });
    return () => ResponsiveObserve.unsubscribe(token);
  });

  $: rowStyle = (() => {
    const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, undefined];
    normalizedGutter.forEach((g, index) => {
      if (typeof g === 'object') {
        for (let i = 0; i < responsiveArray.length; i++) {
          const breakpoint: Breakpoint = responsiveArray[i];
          if (screens[breakpoint] && g[breakpoint] !== undefined) {
            gutters[index] = g[breakpoint] as number;
            break;
          }
        }
      } else {
        gutters[index] = g;
      }
    });
    rowContextState.update(state => ({ ...state, gutter: gutters }));
    const horizontalGutter = gutters[0] != null && gutters[0] > 0 ? gutters[0] / -2 : undefined;
    const verticalGutter = gutters[1] != null && gutters[1] > 0 ? gutters[1] / -2 : undefined;
    if (horizontalGutter) {
      rowStyle.marginLeft = horizontalGutter;
      rowStyle.marginRight = horizontalGutter;
    }
    if (supportFlexGap) {
      // Set gap direct if flex gap support
      [, rowStyle.rowGap] = gutters;
    } else if (verticalGutter) {
      rowStyle.marginTop = verticalGutter;
      rowStyle.marginBottom = verticalGutter;
    }
    return {
      ...rowStyle,
      ...style,
    };
  })();
  $: classes = (() => {
    const prefixCls = getPrefixCls('row', customizePrefixCls);
    return classNames(className, prefixCls, {
      [`${prefixCls}-no-wrap`]: wrap === false,
      [`${prefixCls}-${justify}`]: justify,
      [`${prefixCls}-${align}`]: align,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    });
  })();
</script>

<div role="row" class={classes} style={formatStyle(rowStyle)}>
  <slot />
</div>
