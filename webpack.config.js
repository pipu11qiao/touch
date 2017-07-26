/**
 * Created by Administrator on 2017/7/25 0025.
 */
var path = require('path');
var webpack = require('webpack');

// 区分开发和生产
var env = process.env.NODE_ENV.trim();
var PRODUCTION = env === 'production';
var DEVELOPMENT = env === 'development';

var entry = PRODUCTION ? './src/index.js' : ['./src/index.js', 'webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080'];

var plugins = PRODUCTION
  ? []
  : [ new webpack.HotModuleReplacementPlugin()];

console.log(env);
module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    filename: 'app.js',
    path: path.join(__dirname,'./dist'),
    publicPath: '/dist/'
  },
  module:{
    loaders:[
      //es6
      {
        test: /\.js$/,
        loader:'babel-loader',
        exclude: path.join(__dirname,'./node_modules')
      },
      // img
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader?name=images/[hash:12].[ext]',
        exclude: path.join(__dirname,'./node_modules')
      },
    ]
  },
};