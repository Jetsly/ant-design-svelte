<script>
  import wave from "../_util/wave";
  import classNames from "../_util/classes";
  import { onMount, tick } from "svelte";
  import Icon from "../icon";
  import tooltip from "../tooltip";
  let tooltipConfig;
  export { tooltipConfig as tooltip };
  export let prefixCls = "ant-btn";
  export let type = "default";
  export let htmlType = "button";
  export let icon = "";
  export let shape;
  export let size = "default";
  export let loading;
  export let disabled;
  export let ghost;
  export let block;
  export let href;
  export let target;

  let waveRef;
  let hasTwoCNChar = false;
  let sizeMap = {
    large: "lg",
    small: "sm"
  };

  $: buttonProps = {
    disabled,
    class: classNames({
      [`${prefixCls}`]: true,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-${sizeMap[size]}`]: sizeMap[size],
      // [`${prefixCls}-icon-only`]: !children && children !== 0 && icon,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-background-ghost`]: ghost || type === "ghost",
      // [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar,
      [`${prefixCls}-block`]: block
    })
  };

  $: iconType = loading ? "loading" : icon;

  let havSlot = !!$$props.$$slots;
</script>

{#if href}
  <a {...buttonProps} {href} {target} on:click use:tooltip={tooltipConfig}>
    {#if iconType}
      <Icon type={iconType} />
    {/if}
    {#if havSlot}
      <span>
        <slot />
      </span>
    {:else}
      <slot />
    {/if}
  </a>
{:else}
  <button
    {...buttonProps}
    type={htmlType || 'button'}
    use:wave={type !== 'link'}
    on:click
    use:tooltip={tooltipConfig}>
    {#if iconType}
      <Icon type={iconType} />
    {/if}
    {#if havSlot}
      <span>
        <slot />
      </span>
    {:else}
      <slot />
    {/if}
  </button>
{/if}
