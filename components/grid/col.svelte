<script lang="ts" context="module">
  type ColSpanType = number | string;
  type FlexType = number | 'none' | 'auto' | string;
  function parseFlex(flex: FlexType): string {
    if (typeof flex === 'number') {
      return `${flex} ${flex} auto`;
    }

    if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
      return `0 0 ${flex}`;
    }
    return flex;
  }
</script>

<script lang="ts">
  import getConfigContext from '../config-provider/context';
  import classNames, { formatStyle } from '../_util/classes';
  import getRowContext from './rowContext';

  const { getPrefixCls, direction } = getConfigContext();
  const { gutter, wrap, supportFlexGap } = getRowContext();

  interface ColSize {
    flex?: FlexType;
    span?: ColSpanType;
    order?: ColSpanType;
    offset?: ColSpanType;
    push?: ColSpanType;
    pull?: ColSpanType;
  }

  export { className as class };
  export { customizePrefixCls as prefixCls };
  export let style = undefined;
  export let flex: FlexType = undefined;
  export let span: ColSpanType = undefined;
  export let order: ColSpanType = undefined;
  export let offset: ColSpanType = undefined;
  export let push: ColSpanType = undefined;
  export let pull: ColSpanType = undefined;
  export let xs: ColSpanType | ColSize = undefined;
  export let sm: ColSpanType | ColSize = undefined;
  export let md: ColSpanType | ColSize = undefined;
  export let lg: ColSpanType | ColSize = undefined;
  export let xl: ColSpanType | ColSize = undefined;
  export let xxl: ColSpanType | ColSize = undefined;

  let className = '';
  let customizePrefixCls = '';
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

  $: cellStyle = (() => {
    const mergedStyle: Record<string, string | number> = {};
    if (gutter && gutter[0] > 0) {
      const horizontalGutter = gutter[0] / 2;
      mergedStyle.paddingLeft = horizontalGutter;
      mergedStyle.paddingRight = horizontalGutter;
    }
    if (gutter && gutter[1] > 0 && !supportFlexGap) {
      const verticalGutter = gutter[1] / 2;
      mergedStyle.paddingTop = verticalGutter;
      mergedStyle.paddingBottom = verticalGutter;
    }
    if (flex) {
      mergedStyle.flex = parseFlex(flex);
      if (wrap === false && !mergedStyle.minWidth) {
        mergedStyle.minWidth = 0;
      }
    }
    return {
      ...mergedStyle,
      ...style,
    };
  })();

  $: classes = (() => {
    const prefixCls = getPrefixCls('col', customizePrefixCls);
    let sizeClassObj = {};
    const props = {
      xs,
      sm,
      md,
      lg,
      xl,
      xxl,
    };
    sizes.forEach(size => {
      let sizeProps: Record<string, ColSpanType> = {};
      if (typeof props[size] === 'number' || typeof props[size] === 'string') {
        sizeProps.span = props[size];
      } else if (typeof props[size] === 'object') {
        sizeProps = props[size] || {};
      }
      sizeClassObj = {
        ...sizeClassObj,
        [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
        [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
        [`${prefixCls}-${size}-offset-${sizeProps.offset}`]:
          sizeProps.offset || sizeProps.offset === 0,
        [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
        [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
        [`${prefixCls}-rtl`]: direction === 'rtl',
      };
    });
    return classNames(
      prefixCls,
      {
        [`${prefixCls}-${span}`]: span !== undefined,
        [`${prefixCls}-order-${order}`]: order,
        [`${prefixCls}-offset-${offset}`]: offset,
        [`${prefixCls}-push-${push}`]: push,
        [`${prefixCls}-pull-${pull}`]: pull,
        ...sizeClassObj,
      },
      className,
    );
  })();
</script>

<div role="cell" class={classes} style={formatStyle(cellStyle)}>
  <slot />
</div>
