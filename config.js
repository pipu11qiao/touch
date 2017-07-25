
/**
 * Created by Administrator on 2017/7/25 0025.
 */
//-->> Created by pipu on 2017/7/11.
var path  = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var env = process.env.NODE_ENV.trim();

var PRODUCTION = env === 'production';
var DEVELOPMENT = env === 'development';
// console.log(env);
// console.log(PRODUCTION);
var entry = PRODUCTION
  ? ['./src/index.js']
  : ['./src/index.js', 'webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080'];

var plugins = PRODUCTION
  ? [
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('styles[contenthash:10].css'),
    new HtmlWebpackPlugin({
      template:'index_template.html'
    })
  ]
  : [
    new webpack.HotModuleReplacementPlugin()
  ];
var DefinePlugin = new webpack.DefinePlugin({
  PRODUCTION: PRODUCTION,
  DEVELOPMENT: DEVELOPMENT
});
plugins.push(DefinePlugin);

var cssLoaders = PRODUCTION
  ? ExtractTextPlugin.extract({
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
  externals: {
    jquery: 'jQuery'
  },
  output:{
    filename: PRODUCTION ? 'budle[hash:10].min.js' : 'bundle.js',
    path: path.join(__dirname + '/dist'),
    publicPath: PRODUCTION? '/' :'/dist/'
  },
  module:{
    loaders:[
      //es6
      {
        test: /\.js$/,
        loader:'babel-loader',
        exclude:'./node_modules'
      },
      // img
      {
        test: /\.(jpg|png|gif)$/,
        loader:'url-loader?limit=10000&name=images/[hash:12].[ext]',
        exclude:'./node_modules'
      },
      // css
      {
        test: /\.css$/,
        loaders: cssLoaders,
        exclude:'./node_modules'
      }

    ]
  },
  plugins:plugins,
};