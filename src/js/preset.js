/**
 * Created by Administrator on 2017/7/26 0026.
 */
import $ from 'jquery';
function isPC() {
  let userAgentInfo = navigator.userAgent;
  let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  }
  return flag;
}
let jQueryPreset = function ($) {
  //support

  $.support = (function() {
    var support = {
      // touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
      touch: !isPC()
    };
    return support;
  })();

  $.touchEvents = {
    start: !isPC() ? 'touchstart' : 'mousedown',
    move: !isPC() ? 'touchmove' : 'mousemove',
    end: !isPC() ? 'touchend' : 'mouseup'
  };
  $.getTranslate = function (el, axis) {
    var matrix, curTransform, curStyle, transformMatrix;

    // automatic axis detection aa
    if (typeof axis === 'undefined') {
      axis = 'x';
    }

    curStyle = window.getComputedStyle(el, null);
    if (window.WebKitCSSMatrix) {
      // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case
      transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
    }
    else {
      transformMatrix = curStyle.MozTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
      matrix = transformMatrix.toString().split(',');
    }

    if (axis === 'x') {
      //Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix)
        curTransform = transformMatrix.m41;
      //Crazy IE10 Matrix
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[12]);
      //Normal Browsers
      else
        curTransform = parseFloat(matrix[4]);
    }
    if (axis === 'y') {
      //Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix)
        curTransform = transformMatrix.m42;
      //Crazy IE10 Matrix
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[13]);
      //Normal Browsers
      else
        curTransform = parseFloat(matrix[5]);
    }

    return curTransform || 0;
  };
  /* jshint ignore:start */
  $.requestAnimationFrame = function (callback) {
    if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
    else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
    else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
    else {
      return window.setTimeout(callback, 1000 / 60);
    }
  };
  $.cancelAnimationFrame = function (id) {
    if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
    else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
    else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
    else {
      return window.clearTimeout(id);
    }
  };
  /* jshint ignore:end */
  function __dealCssEvent(eventNameArr, callback) {
    var events = eventNameArr,
      i, dom = this;// jshint ignore:line

    function fireCallBack(e) {
      /*jshint validthis:true */
      if (e.target !== this) return;
      callback.call(this, e);
      for (i = 0; i < events.length; i++) {
        dom.off(events[i], fireCallBack);
      }
    }
    if (callback) {
      for (i = 0; i < events.length; i++) {
        dom.on(events[i], fireCallBack);
      }
    }
  }
  $.fn.animationEnd = function(callback) {
    __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
    return this;
  };
  $.fn.transitionEnd = function(callback) {
    __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
    return this;
  };
  $.fn.transition = function(duration) {
    if (typeof duration !== 'string') {
      duration = duration + 'ms';
    }
    for (var i = 0; i < this.length; i++) {
      var elStyle = this[i].style;
      elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = duration;
    }
    return this;
  };
  $.fn.transform = function(transform) {
    for (var i = 0; i < this.length; i++) {
      var elStyle = this[i].style;
      elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
    }
    return this;
  };
  $.fn.transformX = function (x) {
    return this.transform('translate3d(' + x +'px,0,0)')
  };

  return $;
};

module.exports = jQueryPreset;