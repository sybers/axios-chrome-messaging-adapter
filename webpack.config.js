'use strict';
const path = require('path');
const webpack = require('webpack');
const camelcase = require('camelcase');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { name, version, author, license } = require('./package.json');

const banner = `/*!
 * ${name} ${version}
 * (c) 2019-${new Date().getFullYear()} ${author.name} <${author.email}>
 * Released under the ${license} License.
 */`;

module.exports = (env = {}) => {
  const config = {
    mode: 'none',
    entry: path.resolve(__dirname, 'src'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: name + '.js',
      sourceMapFilename: name + '.js.map',
      library: camelcase(name),
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: "(typeof self !== 'undefined' ? self : this)"
    },
    externals: {
      axios: {
        commonjs: 'axios',
        commonjs2: 'axios',
        amd: 'axios',
        root: 'axios'
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: [new CleanWebpackPlugin()],
    devtool: 'source-map',
    optimization: {
      noEmitOnErrors: true
    }
  };

  if (env.prod) {
    config.optimization = Object.assign(config.optimization || {}, {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          sourceMap: true
        })
      ]
    });

    config.plugins = (config.plugins || []).concat([
      new webpack.BannerPlugin({
        banner,
        raw: true
      })
    ]);
  }

  return config;
};
