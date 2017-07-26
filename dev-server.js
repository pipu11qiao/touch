/**
 * Created by Administrator on 2017/7/25 0025.
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server'); // dev-server
var config = require('./webpack.config'); // webpack配置
var path = require('path');

var compiler = webpack(config);// webpack 编译
var server = new WebpackDevServer(compiler,{
  hot: true,
  compress: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    color: true
  }
});
server.listen('8080',function () {
  console.log('is listening 8080');
});