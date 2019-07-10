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
          src={visible ? 'https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg' : 'https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg'}
          class="code-expand-icon-show"
          on:click={() => (visible = !visible)} />
      </span>
    </div>
  </section>
  <slot name="code" />
</section>
