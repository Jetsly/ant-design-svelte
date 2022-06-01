<script lang="ts" context="module">
  type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
  type ButtonShape = 'default' | 'circle' | 'round';
  type ButtonHTMLType = 'button' | 'submit' | 'reset';
  function isUnBorderedButtonType(type: ButtonType | undefined) {
    return type === 'text' || type === 'link';
  }
</script>

<script lang="ts">
  import getConfigContext, { getSizeContext, type SizeType } from '../config-provider/context';
  import classNames, { formatStyle } from '../_util/classes';
  import wave from '../_util/wave';

  const { getPrefixCls, autoInsertSpaceInButton, direction } = getConfigContext();
  const size = getSizeContext();

  export { className as class };
  export { customizePrefixCls as prefixCls };
  export { customizeSize as size };
  export let type: ButtonType = 'default';
  export let shape: ButtonShape = 'default';
  export let loading: boolean = false;
  export let danger: boolean = false;
  export let ghost: boolean = false;
  export let block: boolean = false;
  export let disabled: boolean = false;
  export let htmlType: ButtonHTMLType = 'button';
  export let icon = '';
  export let style = '';

  let className = '';
  let customizePrefixCls = '';
  let customizeSize: SizeType = undefined;
  let innerLoading: boolean = !!loading;
  let hasTwoCNChar: boolean = false;
  let havSlot = !!$$props.$$slots;

  $: iconType = loading ? 'loading' : icon;
  $: classes = (() => {
    const prefixCls = getPrefixCls('btn', customizePrefixCls);
    const sizeClassNameMap = { large: 'lg', small: 'sm', middle: undefined };
    const sizeFullname = customizeSize || size;
    const sizeCls = sizeFullname ? sizeClassNameMap[sizeFullname] || '' : '';
    const autoInsertSpace = autoInsertSpaceInButton !== false;
    return classNames(
      prefixCls,
      {
        [`${prefixCls}-${shape}`]: shape !== 'default' && shape, // Note: Shape also has `default`
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-${sizeCls}`]: sizeCls,
        [`${prefixCls}-icon-only`]: !havSlot && !!iconType,
        [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
        [`${prefixCls}-loading`]: innerLoading,
        [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace,
        [`${prefixCls}-block`]: block,
        [`${prefixCls}-dangerous`]: !!danger,
        [`${prefixCls}-rtl`]: direction === 'rtl',
      },
      className,
    );
  })();

  $: computeStyle = [
    formatStyle({
      pointerEvents: innerLoading || disabled ? 'none' : undefined,
    }),
    style,
  ];
  $: buttonProps = {
    type: htmlType,
    class: classes,
    disabled,
    style: computeStyle.length == 0 ? undefined : computeStyle.filter(Boolean).join(';'),
  };
</script>

<button use:wave={!isUnBorderedButtonType(type)} {...buttonProps} on:click><slot /></button>
