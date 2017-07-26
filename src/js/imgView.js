/**
 * Created by Administrator on 2017/7/26 0026.
 */
// 接受图片地址在页面渲染 更新图片

import $ from 'jquery';
// @imgArr 左右图片的路径 cb 如果渲染图片过程中出现错误怎么处理
let ImgView = function (imgArr,cb) {
  this.srcArray = imgArr;
  this.imgArray = null; // 图片元素数组
  this.imgAll = false; // 获取图片完成
  this.isMoving = false; // 是否在移动
  this.curIndex = 0; // 当前索引
  this.isInit = true; // 是否是初始化 区分初始和更新
  this.imgVersion = 0; // 记录当前请求的版本，promise无法取消
  this.errorCallback = cb; // 图片渲染出错的处理函数
  this.width = document.body.clientWidth;
  this.height = 0;
  this.isUpdate = true;
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
          me.isInit = true;
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
          console.log(me.width,me.height);
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
    console.log(this);
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

    let itemStr = '';
    me.srcArray.forEach((item) => {
      itemStr += `<li class="imgItem" style="width:${me.width + 'px'};height: ${me.height + 'px'}">
      <img src="${item}" alt="">
    </li>`;
    });

    me.el.$containerEl.html(`<ul class="imgList clearfix" style="width: ${me.srcArray.length * me.width + 'px'};">${itemStr}</ul>`);

  },
  init() {
    this.getImage();
  },
  imgInit() {
    // 图片初始加载完成 绑定事件
    this.getRootElement();
    this.renderHtml();
    console.log(this.el.$containerEl);
  },
  imgUpdate() {
    // 图片更新

  },
  bind(){

  }
};

module.exports = ImgView;
