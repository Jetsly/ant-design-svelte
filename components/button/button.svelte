<svelte:options tag="a-button"/>
<script>
  import "./style/index.js";
  import Wave from '../_util/wave'
  import { onMount,tick } from "svelte";

  export let prefixCls = "ant-btn";
  export let type = "default";
  export let htmlType = "button";
  export let icon;
  export let shape;
  export let size= "default";
  export let loading;
  export let disabled;
  export let ghost;
  export let block;
  export let href;
  let waveRef

  $: buttonProps = {
    class: [`${prefixCls}`,`${prefixCls}-${type}`,`${prefixCls}-${size}`].join(' ')
  };

  onMount(async () => {
    await tick();
    if (type !== 'link') {
      return Wave(waveRef)
    }
  });


</script>
<style>
  @import "main.css";
</style>
{#if href}
  <a {...buttonProps} {href}>
    <slot />
  </a>
{:else}
  <button {...buttonProps} type={htmlType || 'button'} bind:this={waveRef}>
    <slot />
  </button>
{/if}