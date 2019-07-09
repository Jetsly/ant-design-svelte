import path from 'path';
import webpack from 'webpack';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const tsLoader = {
  loader: 'ts-loader',
  options: {
    transpileOnly: true,
  },
};

const config: webpack.Configuration= {
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  entry: {
    antd: './index',
  },
  output: {
    library: 'antd',
    libraryTarget: 'umd',
  },
  stats: {
    modules: false,
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json', '.svelte'],
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
          tsLoader,
          {
            loader: 'svelte-loader',
          },
        ],
      },
      {
        test: /\.(t|mj|j)s$/,
        use: [tsLoader],
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

export default config