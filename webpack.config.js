/* eslint-disable global-require */
require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const VueLoader = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          maxSize: 30000,
          minSize: 10000,
        },
      },
    },
  },
  entry: {
    app: ['./src/client/src/main.js', 'webpack-hot-middleware/client'],
  },
  output: {
    path: resolve('/dist/'),
    filename: 'js/[name].[hash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src/client/src'),
    },
  },
  // cheap-module-eval-source-map is faster for development
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: './src/client/public/index.html',
      title: 'Codie',
    }),
    new VueLoader.VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    ...(process.env.ANALYZE ? [
      new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    ] : []),

    ...(process.env.NODE_ENV === 'production'
      ? [
        new CleanWebpackPlugin(),
      ]
      : [
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsPlugin(),
      ]
    ),
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {},
      },
      {
        test: /\.css$/,
        loader: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true, // optional
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
};
