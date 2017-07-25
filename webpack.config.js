/**
 * Created by Administrator on 2017/7/25 0025.
 */
var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'app.js',
    path: path.join(__dirname,'./dist'),
    publicPath: '/dist/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};