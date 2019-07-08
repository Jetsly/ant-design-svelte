<script>
  let codeBoxClass = "code-box";
  let visible = false;
</script>

<section class={visible?`${codeBoxClass} expand`:codeBoxClass}>
  <slot name="component" />
  <section class="code-box-meta markdown">
    <slot name="title" />
    <slot name="description" />
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