const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const bannerString = `
 WebGazer.js: Democratizing Webcam Eye Tracking on the Browser
 Copyright (c) 2016, Brown WebGazer Team
 Licensed under GPLv3. Companies with a valuation of less than $1M can use WebGazer.js under LGPLv3.
`;

/**
 * 1) UMD-сборка (замена varConfig)
 *    - Файл "webgazer.umd.js"
 *    - libraryTarget: 'umd' даёт доступ через window.webgazer
 */
const umdConfig = {
  entry: './src/index.mjs',
  output: {
    filename: 'webgazer.umd.js',          // <-- меняем имя файла
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'webgazer',                   // window.webgazer
      type: 'umd',                        // важно: UMD вместо var
      export: 'default',
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
      }
    ]
  },
  resolve: {
    extensions: [".mjs", ".webpack.js", ".web.js", ".js", ".json"]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      })
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
  },
  plugins: [
    new webpack.BannerPlugin(bannerString),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            // Копируем итоговый файл + sourcemap
            // Если переименовали в webgazer.umd.js, меняем пути здесь:
            { source: './dist/webgazer.umd.js', destination: './www/' },
            { source: './dist/webgazer.umd.js.map', destination: './www/' },
            { source: './dist/webgazer.umd.js', destination: './www/data/src/' },
            { source: './dist/webgazer.umd.js.map', destination: './www/data/src/' },
          ],
        },
      },
    }),
  ],
  devtool: 'source-map',
};

/**
 * 2) CommonJS2 сборка (как и была)
 *    - Позволяет использовать require('webgazer') в окружениях Node/CommonJS
 */
const commonjs2Config = {
  entry: './src/index.mjs',
  output: {
    filename: 'webgazer.commonjs2.js',
    library: {
      name: 'webgazer',
      type: 'commonjs2',
      export: 'default',
    },
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
      }
    ]
  },
  resolve: {
    extensions: [".mjs", ".webpack.js", ".web.js", ".js", ".json"]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      })
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
  },
  plugins: [
    new webpack.BannerPlugin(bannerString),
  ],
  devtool: 'source-map'
};

module.exports = [umdConfig, commonjs2Config];
