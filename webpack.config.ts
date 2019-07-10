import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');

function addPlugins(ssr = false) {
  return [
    new WebpackBar({
      name: ssr
        ? '🚚  Ant Design Svelte Site SSR'
        : '🚚  Ant Design Svelte Site',
      color: ssr ? '#2f54eb' : '#ec8b1f',
    }),
    new webpack.EnvironmentPlugin({
      MD_DOC_URL: path.join(__dirname, './docs'),
      MD_DEMO_URL: path.join(__dirname, './components'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      titile: 'Ant Design Svelte',
    }),
  ];
}

function getSvelteLoader(ssr = false) {
  return {
    loader: 'svelte-loader',
    options: {
      hydratable: true,
      generate: ssr ? 'ssr' : 'dom',
      preprocess: {
        script: require('./scripts/helpers/svelte-import.ts')({
          libraryDirectory: 'components',
          style: !ssr,
        }),
      },
    },
  };
}

export function createConfig(
  env = {},
  argv = {
    ssr: false,
  },
) {
  const isProd = process.env.NODE_ENV !== 'development';
  const config: Array<webpack.Configuration> = [
    {
      mode: isProd ? 'production' : 'development',
      entry: {
        app: './site/index',
      },
      output: {
        path: isProd ? path.join(__dirname, './_site') : undefined,
        publicPath: '/',
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
          demo: path.resolve(__dirname, './site/theme/template/Content/Demo'),
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
      },
      module: {
        rules: [
          {
            test: /\.svelte$/,
            use: getSvelteLoader(),
          },
          {
            test: /\.md/,
            exclude: /(node_modules)|demo/,
            use: [
              getSvelteLoader(),
              {
                loader: path.resolve('./scripts/helpers/markdown-it-Loader.ts'),
                options: {
                  isDemo: false,
                },
              },
            ],
          },
          {
            test: /\.md/,
            exclude: /(node_modules)/,
            include: /demo/,
            use: [
              getSvelteLoader(),
              {
                loader: path.resolve('./scripts/helpers/markdown-it-Loader.ts'),
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
      plugins: addPlugins(),
      performance: {
        hints: false,
      },
    },
  ];
  if (argv.ssr) {
    config.push({
      mode: 'production',
      entry: {
        app: './site/App',
      },
      output: {
        path: isProd ? path.join(__dirname, './_ssr_site') : undefined,
        publicPath: '/',
        library: 'app',
        libraryTarget: 'commonjs2',
      },
      resolve: {
        extensions: ['.ts', '.mjs', '.js', '.json', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        alias: {
          site: path.resolve(__dirname, './site'),
          demo: path.resolve(__dirname, './site/theme/template/Content/Demo'),
          components: path.resolve(__dirname, './components'),
          'ant-design-svelte': path.resolve(__dirname, './'),
        },
      },
      stats: {
        modules: false,
      },
      module: {
        rules: [
          {
            test: /\.svelte$/,
            use: getSvelteLoader(true),
          },
          {
            test: /\.md/,
            exclude: /(node_modules)|demo/,
            use: [
              getSvelteLoader(true),
              {
                loader: path.resolve('./scripts/helpers/markdown-it-Loader.ts'),
                options: {
                  isDemo: false,
                },
              },
            ],
          },
          {
            test: /\.md/,
            exclude: /(node_modules)/,
            include: /demo/,
            use: [
              getSvelteLoader(true),
              {
                loader: path.resolve('./scripts/helpers/markdown-it-Loader.ts'),
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
        ],
      },
      plugins: addPlugins(true),
      performance: {
        hints: false,
      },
    });
  }
  return config;
}

export default createConfig;
