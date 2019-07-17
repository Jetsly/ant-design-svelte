import webpack from 'webpack';
import path from 'path';

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

export const buildUmdConfig: webpack.Configuration = {
  mode: 'production',
  performance: {
    hints: false,
  },
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
  stats: false,
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
            options: {
              hydratable: true,
            },
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

export default function buildWebpack(config) {
  return new Promise(resolve => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      const buildInfo = stats.toString({
        colors: true,
        children: false,
        chunks: false,
        modules: false,
        chunkModules: false,
        hash: false,
        version: false,
      });
      console.log(buildInfo);
      resolve();
    });
  });
}
