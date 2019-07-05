const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');

module.exports = {
  mode: 'development',
  entry: './site/index.js',
  resolve: {
    extensions: [
      '.ts',
      '.mjs',
      '.js',
      '.json',
    ],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  stats: {
    modules: false,
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }],
    },
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            customElement: true,
            emitCss: true,
          },
        },
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(c|le)ss$/,
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
    new WebpackBar(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: 'site/index.ejs',
      filename: 'index.html',
      inject: true,
    }),
  ],
};
