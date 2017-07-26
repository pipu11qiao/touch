/**
 * Created by Administrator on 2017/7/24 0024.
 */
let setRem = function (win) {
  let doc = win.document, html = doc.documentElement;
  let baseWidth = 750;
  let grids = baseWidth / 100;
  let clientWidth = html.clientWidth || 320;
  html.style.fontSize = clientWidth / grids + "px";
  //let testDom = document.createElement("div");
  let testDomWidth = 0;
  let adjustRatio = 0;
  //setTimeout(calcTestDom, 20);
  let reCalc = function () {
    let newCW = html.clientWidth;
    if (newCW === clientWidth) {
      return
    }
    clientWidth = newCW;
    html.style.fontSize = newCW * (adjustRatio ? adjustRatio : 1) / grids + "px"
  };
  if (!doc.addEventListener) {
    return
  }
  let resizeEvt = "orientationchange" in win ? "orientationchange" : "resize";
  win.addEventListener(resizeEvt, reCalc, false);
  doc.addEventListener("DOMContentLoaded", reCalc, false)
};
module.exports = setRem;