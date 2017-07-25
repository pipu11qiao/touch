/**
 * Created by Administrator on 2017/7/25 0025.
 */
var Finger = require('./js/finger.js');

var finger1 = new Finger();
console.log(finger1);
console.log(3);
if(module.hot) {
  module.hot.accept();
}