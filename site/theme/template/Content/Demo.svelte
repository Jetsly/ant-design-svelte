<script>
  import { getContext } from "svelte";
  const lang = getContext("lang");

  let codeBoxClass = "code-box";
  let visible = false;

  export let meta;
</script>

<section id={meta.id} class={visible ? `${codeBoxClass} expand` : codeBoxClass}>
  <slot name="component" />
  <section class="code-box-meta markdown">
    <div class="code-box-title">{meta.title[lang]}</div>
    {#if lang === 'zh-CN'}
      <slot name="znDesc" />
    {:else}
      <slot name="enDesc" />
    {/if}
    <div class="code-box-actions">
      <span className="code-expand-icon">
        <img
          alt="expand code"
          src={'https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg'}
          class={visible ? 'code-expand-icon-hide' : 'code-expand-icon-show'}
          on:click={() => (visible = !visible)} />
        <img
          alt="expand code"
          src={'https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg'}
          class={visible ? 'code-expand-icon-show' : 'code-expand-icon-hide'}
          on:click={() => (visible = !visible)} />
      </span>
    </div>
  </section>
  {#if visible}
    <section class="highlight-wrapper highlight-wrapper-expand">
      <slot name="code" />
    </section>
  {/if}
</section>
