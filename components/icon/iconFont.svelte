<script context="module">
  const customCache = new Set();
  export function createFromIconfontScriptCN(options = {}) {
    const { scriptUrl, extraCommonProps = {} } = options;
    if (
      typeof document !== "undefined" &&
      typeof window !== "undefined" &&
      typeof document.createElement === "function" &&
      typeof scriptUrl === "string" &&
      scriptUrl.length &&
      !customCache.has(scriptUrl)
    ) {
      const script = document.createElement("script");
      script.setAttribute("src", scriptUrl);
      script.setAttribute("data-namespace", scriptUrl);
      customCache.add(scriptUrl);
      document.body.appendChild(script);
    }
  }
</script>

<script>
  import Icon from "./icon.svelte";
  export let type;
  let a;
</script>

<Icon>
  <use slot="only-path" xlink:href={`#${type}`} />
</Icon>
