---
order: 1
title: 快速上手
---

Ant Design Svelte 致力于提供给程序员**愉悦**的开发体验。

> 在开始之前，推荐先学习 [Svelte](https://svelte.dev/) 和 [ES2015](http://babeljs.io/docs/learn-es2015/)，并正确安装和配置了 [Node.js](https://nodejs.org/) v8 或以上。官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识，并且已经完全掌握了 Svelte 全家桶的正确开发方式。如果你刚开始学习前端或者 Svelte，将 UI 框架作为你的第一步可能不是最好的主意。

---

## 引入ant-design-svelte

### 1. 安装组件

```bash
$ npm i --save ant-design-svelte
```

### 2. 使用组件

直接用下面的代码替换 `App.svelte` 的内容，用 svelte 的方式直接使用 antd 组件。

```html
<script>
import { Button } from 'ant-design-svelte';
</script>
<div>
  <Button type="primary">Primary</Button>
  <Button>Default</Button>
  <Button type="dashed">Dashed</Button>
  <Button type="danger">Danger</Button>
</div>
```

### 3. 挂载组件

直接用下面的代码替换 `inedx.js` 的内容

```js
import App from './App.svelte';
const app = document.createElement('app');
document.body.appendChild(a);
new App({
  target: app,
});
```

### 4. webpack配置

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            hydratable: true,
            preprocess: {
              script: require('ant-design-svelte/helpers/svelte-import')({
                libraryDirectory: 'es',
                style: 'css',
              }),
            },
          },
        },
      },
      {
        test: /\.(c|le)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({}),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};
```



