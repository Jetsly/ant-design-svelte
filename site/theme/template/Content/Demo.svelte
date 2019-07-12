<script>
  import { getContext } from "svelte";
  import { Icon } from "ant-design-svelte";
  import classes from "components/_util/classes";
  import LZString from "lz-string";
  import copy from "copy-to-clipboard";
  const lang = getContext("lang");

  let codeBoxClass = "code-box";
  let visible = false;

  export let meta;

  let sourceCode = null;
  let codesanboxPrefillConfig = null;
  let copied = false;

  function source(node) {
    sourceCode = node.textContent;
    codesanboxPrefillConfig = {
      files: {
        "package.json": {
          content: {
            dependencies: {
              svelte: "^3.6.4",
              "ant-design-svelte": "latest"
            }
          }
        },
        "src/index.js": {
          content: `import App from "./App.svelte";
new App({
  target: document.getElementById("container")
});
`
        },
        "src/App.svelte": {
          content: `${sourceCode}`
        },
        "index.html": {
          content: `<div id="container" style="padding: 24px"></div>
<link
  rel="stylesheet"
  type="text/css"
  href="//unpkg.com/ant-design-svelte@0.0.1-alpha.2/dist/antd.css"
/>
`
        }
      }
    };
  }

  function copyToClipboard() {
    copied = copy(sourceCode);
  }

  function compress(string) {
    return LZString.compressToBase64(string)
      .replace(/\+/g, "-") // Convert '+' to '-'
      .replace(/\//g, "_") // Convert '/' to '_'
      .replace(/=+$/, ""); // Remove ending '='
  }
</script>

<section id={meta.id} class={visible ? `${codeBoxClass} expand` : codeBoxClass}>
  <slot name="component" />
  <section class="code-box-meta markdown">
    <div class="code-box-title">
      <a href={`#${meta.id}`}>{meta.title[lang]}</a>
    </div>
    {#if lang === 'zh-CN'}
      <slot name="znDesc" />
    {:else}
      <slot name="enDesc" />
    {/if}
    <div class="code-box-actions">
      <form
        action="https://codesandbox.io/api/v1/sandboxes/define"
        method="POST"
        target="_blank">
        <input
          type="hidden"
          name="parameters"
          value={compress(JSON.stringify(codesanboxPrefillConfig))} />
        <input
          type="submit"
          value="Create New Sandbox with Prefilled Data"
          class="code-box-codesandbox" />
      </form>
      <Icon
        type={copied ? 'check' : 'snippets'}
        class="code-box-code-copy"
        on:click={copyToClipboard}
        on:mouseout={()=>{copied = false}} />
      <span class="code-expand-icon">
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
  <section
    class={classes({
      'highlight-wrapper': true,
      'highlight-wrapper-expand': visible
    })}
    use:source>
    <slot name="code" />
  </section>
</section>
