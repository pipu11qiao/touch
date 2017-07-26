/**
 * Created by Administrator on 2017/7/25 0025.
 */
var path = require('path');
var webpack = require('webpack');
var ExtractPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 区分开发和生产
var env = process.env.NODE_ENV.trim();
var PRODUCTION = env === 'production';
var DEVELOPMENT = env === 'development';

var entry = PRODUCTION ? './src/index.js' : ['./src/index.js', 'webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080'];
// plugin
console.log(PRODUCTION);

var plugins = PRODUCTION
  ? [
    new ExtractPlugin('style-[contenthash:10].css'),
    new HtmlWebpackPlugin({
      template: './index-template.html'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
  : [new webpack.HotModuleReplacementPlugin()];

// definePlugin
plugins.push(new webpack.DefinePlugin({
  DEVELOPMENT: JSON.stringify(DEVELOPMENT),
  PRODUCTION: JSON.stringify(PRODUCTION)
}));

var cssLoaders = PRODUCTION
  ? ExtractPlugin.extract({
    loader:
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[hash:base64:10]'
        }
      }
  })
  : ['style-loader','css-loader?localIdentName=[path][name] --- [local]'];

module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: path.join(__dirname,'./dist'),
    publicPath: PRODUCTION ? '/' : '/dist/',
    filename: PRODUCTION ? 'app[hash:12].min.js': 'app.js'
  },
  externals: {
    zepto: 'Zepto',
    jquery: 'jQuery'
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
        loaders: 'url-loader?limit=10000&name=images/[hash:12].[ext]',
        exclude: path.join(__dirname,'./node_modules')
      },
      // css
      {
        test: /\.css$/i,
        loaders: cssLoaders,
        exclude: path.join(__dirname,'./node_modules')
      }
    ]
  },
};