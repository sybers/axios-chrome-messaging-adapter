'use strict'
const path = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const inputPath = path.join(__dirname, 'src')
const outputPath = path.join(__dirname, 'dist')

const libraryName = 'axiosChromeMessagingAdapter'

function generateLibraryConfig(name) {

  const uglify = name.match(/\.min$/)

  const config = {
    mode: 'none',
    entry: inputPath,
    output: {
      path: outputPath,
      filename: name + '.js',
      sourceMapFilename: name + '.js.map',
      library: libraryName,
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: '(typeof self !== \'undefined\' ? self : this)'
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
          options: {
            transpileOnly: true
          },
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: [],
    devtool: 'source-map',
    optimization: {
      noEmitOnErrors: true
    }
  }

  if (uglify) {
    config.optimization = Object.assign(config.optimization || {}, {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          sourceMap: true
        })
      ]
    })

    config.plugins = (config.plugins || []).concat([
      // add production only plugins here...
    ])
  }

  return config
}

module.exports = ['axios-chrome-messaging-adapter', 'axios-chrome-messaging-adapter.min'].map(generateLibraryConfig)
