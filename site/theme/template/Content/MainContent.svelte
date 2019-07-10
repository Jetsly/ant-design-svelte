<script>
  import { Row, Col } from "ant-design-svelte";
  import { getContext } from "svelte";
  const lang = getContext("lang");
  export let doc;
  export let demos;
</script>

<Row>
  <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24} class="main-menu">
    <section class="main-menu-inner">menu</section>
  </Col>
  <Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24}>
    <section class="main-container main-container-component">
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
      <article>
        <section class="markdown">
          <h1>
             {doc.meta.title}
            {#if doc.meta.subtitle}
              <span class="subtitle">{doc.meta.subtitle}</span>
            {/if}
          </h1>
          <section class="markdown">
            <svelte:component this={doc.default} />
          </section>
          <h2><span>代码演示</span></h2>
        </section>
        <Row gutter={16}>
          {#each demos as demo}
            <Col span={24} class={'code-boxes-col-1-1'}>
              <svelte:component this={demo.default} />
            </Col>
          {/each}
        </Row>
        <div class="markdown api-container">
          {@html doc.api || ''}
        </div>
      </article>
    </section>
  </Col>
</Row>
