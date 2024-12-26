// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',             // сборка в режиме продакшн
  entry: './src/index.js',        // ваш входной файл
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'myLib.bundle.js',

    // Важно для UMD-версии:
    library: 'MyLib',             // имя глобальной переменной, например window.MyLib
    libraryTarget: 'umd'          // формат UMD, чтобы не требовалось require()
  }
};
