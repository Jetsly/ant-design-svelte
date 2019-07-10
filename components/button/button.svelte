<svelte:options tag="ant-button"/>
<script>
  import Wave from '../_util/wave'
  import classNames from '../_util/classes'
  import { onMount,tick } from "svelte";

  export let prefixCls = "ant-btn";
  export let type = "default";
  export let htmlType = "button";
  export let icon="";
  export let shape;
  export let size= "default";
  export let loading;
  export let disabled;
  export let ghost;
  export let block;
  export let href;

  let waveRef;
  let hasTwoCNChar = false;
  let sizeMap= {
    large: 'lg',
    small: 'sm',
  };

  $: buttonProps = {
    disabled,
    class: classNames({
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: type,
        // [`${prefixCls}-${shape}`]: shape,
        // [`${prefixCls}-${sizeMap[size]}`]: sizeMap[size],
        // [`${prefixCls}-icon-only`]: !children && children !== 0 && icon,
        // [`${prefixCls}-loading`]: loading,
        [`${prefixCls}-background-ghost`]: ghost || type === 'ghost',
        // [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar,
        [`${prefixCls}-block`]: block,
    })
  };

  onMount(async () => {
    await tick();
    if (type !== 'link') {
      return Wave(waveRef)
    }
  });


</script>
{#if href}
  <a {...buttonProps} {href} on:click>
    <slot />
  </a>
{:else}
  <button {...buttonProps} type={htmlType || 'button'} bind:this={waveRef}  on:click>
    <slot />
  </button>
{/if}