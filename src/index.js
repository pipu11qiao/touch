/**
 * Created by Administrator on 2017/7/25 0025.
 */
var Finger = require('./js/finger');
var message = require('./js/message');
// var ketten = require('./js/ketten');


import ketten from './js/ketten';
console.log(ketten);

var finger1 = new Finger();
console.log(finger1);
var appEl = document.getElementById('app');
appEl.innerHTML = `<h1>${message.text1}</h1><br/><h1>${message.text2}</h1>${ketten}`;
if (module.hot) {
  module.hot.accept();
}