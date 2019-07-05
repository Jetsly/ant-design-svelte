<svelte:options tag="a-button"/>
<script>
  import "./style/index.js";
  import Wave from '../_util/wave.svelte'

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

  $: buttonProps = {
    class: [`${prefixCls}`,`${prefixCls}-${type}`,`${prefixCls}-${size}`].join(' ')
  };
</script>
<style>
  @import "main.css";
</style>
<Wave>
{#if href}
  <a {...buttonProps} {href}>
    <slot />
  </a>
{:else}
  <button {...buttonProps} type={htmlType || 'button'}>
    <slot />
  </button>
{/if}
</Wave>