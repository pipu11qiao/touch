/**
 * Created by Administrator on 2017/7/26 0026.
 */
// 接受图片地址在页面渲染 更新图片

import $ from 'jquery';
var jQueryPreset = require('./preset');
jQueryPreset($);
let start = $.touchEvents.start;
let move = $.touchEvents.move;
let end = $.touchEvents.end;
let isPhone = $.support.touch;
let getTarget = function (e) {
  if(isPhone){
    return e.touches[0];
  }
  return e;
};
// @imgArr 左右图片的路径 cb 如果渲染图片过程中出现错误怎么处理
let ImgView = function (imgArr,cb) {
  this.srcArray = imgArr;
  this.imgArray = null; // 图片元素数组
  // this.imgAll = false; // 获取图片完成
  this.isMoving = false; // 是否在移动
  this.curIndex = 0; // 当前索引
  this.isInit = true; // 是否是初始化 区分初始和更新
  this.imgVersion = 0; // 记录当前请求的版本，promise无法取消
  this.errorCallback = cb; // 图片渲染出错的处理函数
  this.width = document.body.clientWidth;
  this.height = 0;
  this.isUpdate = false;
  this.isStart = false;
  this.minDistance = 5;
  this.firstX = 0;
  this.preX = 0;
  this.duration = 400;
  this.el = {
    $containerEl: null,
    $imgListEl: null,
    $imgItemEls: null,
    $indexListEl: null,
    $indexItemEls: null
  };
  this.init();
};
ImgView.prototype = {
  constructor: ImgView,
  getImage: function () {
    let me = this;
    me.imgVersion += 1;
    let differs = me.getImgDiffers();

    $.when.apply($, differs)
      .done(function () {
        let arr = Array.prototype.slice.call(arguments, 0);
        // 所有图片加载成功
        me.imgArray = [];
        arr.forEach(function (item) {
          me.imgArray.push(item.img);
        });
        if(me.isInit) {
          me.isInit = false;
          me.imgInit();
        }
        if(me.isUpdate) {
          me.imgUpdate()
        }
        // console.log('success img');
      })
      .fail(function () {
        let arr = Array.prototype.slice.call(arguments, 0);
        let isRightVersion = arr.some(function (item) {
          return item.imgVersion = me.imgVersion;
        });
        if (isRightVersion) {
          if (typeof me.errorCallback === 'function') {
            me.errorCallback();
          } else {
            console.log('图片渲染失败');
          }
        }
    });
  },
  getImgDiffer(src) {
    let me = this;
    let dtd = $.Deferred(); // 新建一个Deferred对象
    let wait = function(dtd){
      let img = new Image();
      img.onload = function () {
        img.onload = null;
        if(me.height === 0) {
          let width = img.width;
          let height = img.height;
          me.height = parseInt(me.width * height / width);
        }
        dtd.resolve({imgVersion: me.imgVersion,img}); // 改变Deferred对象的执行状态
      };
      img.onerror = function () {
        img.onerror = null;
        dtd.reject({imgVersion: me.imgVersion,img}); // 改变Deferred对象的执行状态
      };
      img.src = src;
      return dtd.promise(); // 返回promise对象
    };
    return wait(dtd); // 新建一个d对象，改为对这个对象进行操作
  },
  getImgDiffers () {
    var me = this;
    let arr = [];
    this.srcArray.forEach(function (item) {
      arr.push(me.getImgDiffer(item));
    });
    return arr;
  },
  getRootElement() {
    if(DEVELOPMENT) {
      $(document.body).html(`<div class="title">标题</div></div><div class="imgView" style="height: ${this.height + 'px'}"></div><div class="optionView">选项</div>`);
    } else {
      $(document.body).append(`<div class="title">标题</div></div><div class="imgView" style="height: ${this.height + 'px'}"></div><div class="optionView">选项</div>`);
    }

    this.el.$containerEl = $('.imgView');

  },
  renderHtml() {
    let me = this;
    // todo 不开启自动循环拖动 现在是可以循环拖动
    me.srcArray.push(me.srcArray[0]);
    me.srcArray.unshift(me.srcArray[me.srcArray.length-2]);

    if (!me.isUpdate) {
      let itemStr = '';
      let indexStr = ''
      me.srcArray.forEach((item, index) => {
        itemStr += `<li class="imgItem" style="width:${me.width + 'px'};height: ${me.height + 'px'}">
      <img src="${item}" alt="">
    </li>`;
        if (index !== 0 && index !== me.srcArray.length - 1) {
          indexStr += `<li class="indexItem ${index === 1 ? 'active' : ''}"></li>`
        }
      });
      me.el.$containerEl.html(`<ul class="imgList clearfix" style="width: ${me.srcArray.length * me.width + 'px'}; ">${itemStr}</ul>
                               <ul class="indexList clearfix">${indexStr}</ul>`);
      me.el.$imgListEl = me.el.$containerEl.find('.imgList'); // 获取imgUl
      me.move(-me.width, false);
      me.el.$imgItemEls = me.el.$containerEl.find('.imgItem'); // 获取imgLi

      me.el.$indexListEl = me.el.$containerEl.find('.indexList'); // 获取indexUl
      me.el.$indexItemEls = me.el.$containerEl.find('.indexItem'); // 获取indexLi
    } else {
      console.log('更新');
      // 更新
      me.el.$imgItemEls.each(function (i, item) {
        console.log(this);
        $(this).find('img')[0].src = me.srcArray[i];
      })
    }
  },
  init() {
    this.getImage();
  },
  imgInit() {
    // 图片初始加载完成 绑定事件
    this.getRootElement();
    this.renderHtml();
    this.bind();
    // console.log(this.el.$containerEl);
  },
  update(imgArrs) {
    this.isUpdate = true;
    this.srcArray = imgArrs;
    this.getImage();

  },
  imgUpdate() {
    // 图片更新
    this.renderHtml()

  },
  move: function (distance,type) {
    // type 为true 是动效，为 false 无动效
    this.el.$imgListEl.transition(type ? this.duration : 0);
    if(type) {
      let clientLeft = this.el.$imgListEl[0].clientLeft;
    }
    this.el.$imgListEl.transformX(distance);
  },
  transitionMove: function () {
    let me = this;
    // 根据当前位置判断是第几个，移动过去，并且对应上图标。
    let curX = $.getTranslate(me.el.$imgListEl[0],'x');

    if(parseInt(Math.abs(curX)) !== parseInt(Math.abs((me.curIndex + 1)  * me.width))) {
      me.isMoving = true;
      me.getMoveToIndex();
      console.log(me.curIndex);
      me.move(-((me.curIndex + 1)  * me.width),true);
    }

  },
  getMoveToIndex() {
    // 判断用户移动距离有没有大于二分之一如果大于就进行移动没大于就回去。
    let me = this;
    let delIndex;
    let delX = me.preX - me.firstX;
    if(Math.abs(delX) >= me.width /2 ) {
        if(delX < 0) {
          // 向右
          delIndex = Math.ceil(Math.abs(delX) / me.width);
          me.curIndex += delIndex;
        } else {
          // 向左
          delIndex = Math.ceil(Math.abs(delX) / me.width);
          me.curIndex -= delIndex;
        }

    }
  },
  updateIndex() {
    let me = this;
    let curX = $.getTranslate(me.el.$imgListEl[0],'x');
    let renderIndex = Math.floor((Math.abs(curX)- me.width / 2) / me.width);
    // console.log(renderIndex);
    if(renderIndex === -1) {
      renderIndex = me.srcArray.length -3;
    } else if(renderIndex === me.srcArray.length -2) {
      renderIndex = 0;
    }
    let $activeIndexEl = me.el.$indexListEl.find('.active');
    let curIndex = $activeIndexEl.index() ;
    // console.log(renderIndex);
    if(renderIndex !== curIndex) {
      // 需要渲染
      $activeIndexEl.removeClass('active');
      $(me.el.$indexItemEls.get(renderIndex)).addClass('active');
    }
  },
  bind(){
    // 给ul元素绑定事件
    let me = this;
    me.el.$containerEl.on(start,function (e) {
      e.preventDefault();
      let target = getTarget(e);
      me.isStart = true;
      me.firstX = target.clientX;
      me.preX = target.clientX;
    }).on(end,function () {
      me.isStart = false;

      me.transitionMove();
      // console.log(3);
    }).on(move,function (e) {
      let target = getTarget(e)
      if(me.isStart && !me.isMoving) {
        let delX = parseInt(target.clientX - me.preX);
        // 获得 ul的translate 并实时改变
        let curX = $.getTranslate(me.el.$imgListEl[0],'x');
        if(Math.abs(delX) > me.minDistance) {
          me.preX = target.clientX;
          me.move(curX + delX,false);
          me.updateIndex();
        }

      }
    }).on('mouseout',function () {
      me.isStart = false;
    }).on('transitionend',function (e) {
      me.isMoving = false;
      me.updateIndex();
      if(me.curIndex === -1 || me.curIndex === 6){
        if(me.curIndex === -1) {
          me.curIndex = me.srcArray.length - 3;
        }else {
          me.curIndex = 0;
        }
        me.move(-((me.curIndex + 1) * me.width),false);
      }
    })
  }
};

module.exports = ImgView;
