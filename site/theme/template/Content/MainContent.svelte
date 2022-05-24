<script>
  import { getContext, onMount } from 'svelte';
  import { router } from 'tinro';
  import { Row, Col } from 'ant-design-svelte';
  const lang = getContext('lang');
  export let doc;
  export let demos = [];
  $: isMobile = false;
  $: selectedKeys = [];
  onMount(() => {
    let mounted = true;
    const mq = window.matchMedia('(max-width: 750px)');
    function listener(ev) {
      if (!mounted) return;
      isMobile = mq.matches;
      console.log(isMobile);
    }
    mq.addEventListener('change', listener);
    isMobile = mq.matches;
    selectedKeys = [location.pathname];
    console.log(isMobile);
    return () => {
      mounted = false;
      mq.removeEventListener('change', listener);
    };
  });
  function handleMenu({ detail }) {
    selectedKeys = detail.selectedKeys;
    router.goto(selectedKeys[0]);
  }
</script>

<Row>
  <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24} class="main-menu">
    {#if !isMobile}
      <section class="main-menu-inner">
        <!-- <Menu
          inlineIndent="40"
          class="aside-container menu-site"
          {selectedKeys}
          mode="inline"
          on:select={handleMenu}>
          <Menu.Item key="/docs/getting-started">快速上手</Menu.Item>
          <Menu.SubMenu key="/components">
            <div slot="title">Components</div>
            <Menu.ItemGroup>
              <div slot="title">通用</div>
              <Menu.Item key="/components/button/">Button 按钮</Menu.Item>
              <Menu.Item key="/components/icon/">Icon 图标</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup>
              <div slot="title">布局</div>
              <Menu.Item key="/components/grid/">Grid 栅格</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup>
              <div slot="title">数据展示</div>
              <Menu.Item key="/components/tooltip/">Tooltip 文字提示</Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
        </Menu> -->
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
              <!-- <Icon type="appstore" class="code-box-expand-trigger" /> -->
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
