/**
 * Created by Administrator on 2017/7/25 0025.
 */
// 样式文件
let resetStyle = require('./css/reset.css');
let pageStyle = require('./css/page.css');
let imgViewStyle = require('./css/imgView.css');

// js 文件
import $ from 'jquery';

let Finger = require('./js/finger');
let setRem = require('./js/setRem'); // rem 设置
let ImgView = require('./js/imgView');

setRem(window); // 控制页面 rem单位


let imgs = [
  'http://mrmsapi.markormake.com/modules/lemon/uploads/files/render_image_92052634991706848870730027.png',
  'http://mrmsapi.markormake.com/modules/lemon/uploads/files/render_image_21321806963537257822905667.png',
  'http://mrmsapi.markormake.com/modules/lemon/uploads/files/render_image_77808730397375603751242160.png',
  'http://mrmsapi.markormake.com/modules/lemon/uploads/files/render_image_87692624004551523366542533.png',
  'http://mrmsapi.markormake.com/modules/lemon/uploads/files/render_image_40618622768671569738979451.png',
  'http://mrmsapi.markormake.com/modules/lemon/uploads/files/render_image_76013595424591486471383832.png'
];

let imgeView = new ImgView(imgs);

if(DEVELOPMENT) {
  if(module.hot) {
    module.hot.accept();
  }
}
