//-->> Created by pipu on 2017/7/23.
// 树结构数据 和 互斥数据 的生成 互斥数据中的id需要在生成树结构数据的时候进行记录
let fs = require('fs');
let path = require('path');
const NUM = 6; // 控制菜单数量
const ONENUMMIN = 3; // 控制一级子菜单数量最少值
const ONENUMMAX = 7; // 控制一级子菜单数量最大值
const TWONUMMIN = 4; // 控制二级子菜单数量最少值
const TWONUMMAX = 15; //控制二级子菜单数量最大值

const RATIO = 0.5; // 控制一级子菜单在所有子菜单中的占比
const TYPERATIONAME = 0.5; // 类型 ’name' 占得比例
const TYPERATIOICON = 0.2; // 类型 ‘icon' 占的比例


const PREMAINID = 'main';
const PREONEID = 'one';
const PRETWOID = 'two';

const ICONS = [
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/image_89452052582051903304699808.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/image_44906809274101052919505164.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/image_58208225993439811063720844.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/image_16303418390450150279151275.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/image_93976530013601156056257896.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/image_96166857331991780205406248.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/60740263620392775223711505.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/image_31752901943408565759276971.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/12263169232759272364759817.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/image_05952400108798313975096680.jpg',
    'http://mrmsapi.markormake.com/modules/lemon/uploads/files/90365936746822095538415014.jpg'
];

let disableData = {}; // 互斥数据的记录

let getIcon = function () {
    let num = ICONS.length;
    let index = Math.floor(Math.random() * num);
    return ICONS[index];
};

// 由小到大写起
let getType = function () {
    let ratio = Math.random(); // [0,1)
    let view_type;
    if (ratio < TYPERATIONAME) {
        view_type = 'name';
    } else if (ratio < TYPERATIONAME + TYPERATIOICON) {
        view_type = 'icon';
    } else {
        view_type = 'icon_name';
    }
    return view_type;
};

// 选项菜单 保证view_type 是一样的
let GetTwoData = function (index, view_type) {
    // {
    //   "icon" : "",
    //   "name" : "曲线型面板",
    //   "optionid" : "",
    //   "view_type" : "name"
    // }
    this.icon = getIcon();
    this.name = '选项' + index;
    this.optionid = PRETWOID + index;
    this.view_type = view_type;
    this.has_sub = '0';
    this.sub_options = [];
};
let getOptionData = function (pre) {
    let sub_options = [];
    // 子集菜单生成 获得数量
    let num = Math.ceil(Math.random() * (TWONUMMAX - TWONUMMIN) + TWONUMMIN);
    let view_type = getType();
    let curTwoObj;
    for (let i = 0; i < num; i++) {
        curTwoObj = new GetTwoData(pre + i, view_type);
        disableData[curTwoObj.optionid] = '0';
        sub_options.push(curTwoObj);
    }
    return sub_options;
};
let getOneOptionData = function (pre) {
    let sub_options = [];
    // 子集菜单生成 获得数量
    let num = Math.ceil(Math.random() * (ONENUMMAX - ONENUMMIN) + ONENUMMIN);
    let curOneObj;
    for (let i = 0; i < num; i++) {
        curOneObj = new GetOneData(pre + '一级' + i + '|');
        // disableData[curOneObj.optionid] = '0';
        sub_options.push(curOneObj);
    }
    return sub_options;
};
// 一级菜单
let GetOneData = function (index) {

    this.icon = '';
    this.name = '一级菜单' + index;
    this.optionid = PREONEID + index;
    // this.view_type = getType();
    this.view_type = 'name';
    this.has_sub = '1';
    this.sub_options = getOptionData(index + '|');
};

// 主菜单

let GetMainData = function (index) {
    this.icon = '';
    this.name = '主菜单' + index;
    this.optionid = PREMAINID + index;
    // this.view_type = getType();
    this.view_type = 'name';
    this.has_sub = '1';
    // 根据比例判断该生生成一级菜单还是二级菜单
    let num = Math.random();
    let sub_options;
    if (num < RATIO) {
        // 直接子菜单
        sub_options = getOptionData('|主' + index + '|');
    } else {
        sub_options = getOneOptionData('|主' + index + '|');
    }
    this.sub_options = sub_options
};
let getData = function () {
    let data = [];
    let curMainObj;
    for (let i = 0; i < NUM; i++) {
        curMainObj = new GetMainData(i);
        // disableData[curMainObj.optionid] = '0';
        data.push(curMainObj);
    }
    return data;
};


fs.writeFile('./treeData.json', JSON.stringify(getData()), 'utf-8', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('写树结构数据成功！');
});

fs.writeFile('./disableData.json', JSON.stringify(disableData), 'utf-8', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('写互斥数据成功！');
});