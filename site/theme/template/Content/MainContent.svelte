<script>
  import { getContext, onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { Menu, Row, Col, Icon } from "ant-design-svelte";
  import { mdDocList, mdDemoList } from "./page.ts";

  const lang = getContext("lang");
  export let doc;
  export let demos = [];

  let isMobile = false;
  let selectedKeys = [];
  onMount(() => {
    let mounted = true;
    const mq = window.matchMedia("(max-width: 750px)");
    function listener(ev) {
      if (!mounted) return;
      isMobile = mq.matches;
    }
    mq.addEventListener("change", listener);
    isMobile = mq.matches;
    selectedKeys = [location.pathname];
    return () => {
      mounted = false;
      mq.removeEventListener("change", listener);
    };
  }, []);

  function handleMenu({ detail }) {
    selectedKeys = detail.selectedKeys;
    navigate(selectedKeys[0]);
  }

  const docsMap = mdDocList
    .keys()
    .map(key => mdDocList(key).meta)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      ...item,
      key: "/" + item.filename.replace(RegExp(`(index)?.${lang}.md`), "")
    }));

  const comptsMap = mdDemoList
    .keys()
    .filter(key => RegExp(`.${lang}.md`).test(key))
    .map(key => mdDemoList(key).meta)
    .map(item => ({
      ...item,
      key: "/" + item.filename.replace(RegExp(`index.${lang}.md`), "")
    }))
    .reduce((pre, val) => {
      const idx = pre.findIndex(a => a.type === val.type);
      if (idx == -1) {
        return [
          ...pre,
          {
            type: val.type,
            group: [val]
          }
        ];
      } else {
        pre[idx].group.push(val);
        return pre;
      }
    }, []);
</script>

<Row>
  <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24} class="main-menu">
    {#if !isMobile}
      <section class="main-menu-inner">
        <Menu
          inlineIndent="40"
          class="aside-container menu-site"
          {selectedKeys}
          mode="inline"
          on:select={handleMenu}>
          {#each docsMap as doc}
            <Menu.Item key={doc.key}>{doc.title}</Menu.Item>
          {/each}
          <Menu.SubMenu key="/components">
            <div slot="title">Components</div>
            {#each comptsMap as comptGroup}
              <Menu.ItemGroup>
                <div slot="title">{comptGroup.type}</div>
                {#each comptGroup.group as compt}
                  <Menu.Item key={compt.key}>
                    {compt.title} {compt.subtitle}
                  </Menu.Item>
                {/each}
              </Menu.ItemGroup>
            {/each}
          </Menu.SubMenu>
        </Menu>
      </section>
    {/if}
  </Col>
  <Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24}>
    <section class="main-container main-container-component">
      {#if demos.length}
        <class class="toc-affix" offsetTop={16}>
          <ul id="demo-toc" class="toc">
            {#each demos as demo}
              {#if !demo.meta.type}
                <li key={demo.meta.id} title={demo.meta.title[lang]}>
                  <a href={`#${demo.meta.id}`}>{demo.meta.title[lang]}</a>
                </li>
              {/if}
            {/each}
          </ul>
        </class>
      {/if}
      <article>
        <section class="markdown">
          {#if doc}
            <h1>
              {doc.meta.title}
              {#if doc.meta.subtitle}
                <span class="subtitle">{doc.meta.subtitle}</span>
              {/if}
            </h1>
            <section class="markdown">
              <svelte:component this={doc.default} />
            </section>
          {/if}
          {#if demos.length}
            <h2>
              <span>代码演示</span>
              <Icon type="appstore" class="code-box-expand-trigger" />
            </h2>
          {/if}
        </section>
        {#if demos.length}
          <Row gutter={16}>
            {#each demos as demo}
              <Col span={24} class={'code-boxes-col-1-1'}>
                <svelte:component this={demo.default} />
              </Col>
            {/each}
          </Row>
        {/if}
        <div class="markdown api-container">
          {@html doc ? doc.api : ''}
        </div>
      </article>
    </section>
  </Col>
</Row>
