import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const isProd = process.env.NODE_ENV !== 'development';
const config: webpack.Configuration = {
  mode: isProd ? 'production' : 'development',
  entry: './site/index',
  output: {
    path: path.join(__dirname, './_site'),
    publicPath: './',
  },
  optimization: {
    minimizer: isProd
      ? [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin({})]
      : [],
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    alias: {
      site: path.resolve(__dirname, './site'),
      components: path.resolve(__dirname, './components'),
      'ant-design-svelte': path.resolve(__dirname, './'),
    },
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
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            hydratable: true,
          },
        },
      },
      {
        test: /\.md/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              hydratable: true,
              preprocess: {
                script: require('./helpers/svelte-import.ts'),
              },
            },
          },
          {
            loader: path.resolve('./helpers/markdown-it-Loader.ts'),
            options: {
              html: true,
            },
          },
        ],
      },
      {
        test: /\.(ts|js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
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

export default config;
