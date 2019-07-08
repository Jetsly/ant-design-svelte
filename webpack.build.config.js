const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
  entry: {
    antd: './index.js',
  },
  output: {
    library: 'antd',
    libraryTarget: 'umd',
  },
  stats: {
    modules: false,
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'svelte-loader',
          },
        ],
      },
      {
        test: /\.(t|mj|j)s$/,
        include: /node_modules\/svelte/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(t|mj|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(c|le)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          { loader: 'less-loader', options: { javascriptEnabled: true } },
        ],
      },
    ],
  },
  plugins: [
    new WebpackBar({
      name: '🚚  Ant Design Svelte Tools',
      color: '#2f54eb',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};
