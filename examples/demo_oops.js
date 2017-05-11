/**
 * 测试oops api
 */
let path = require('path');
let oops = require('../lib/oops.js');

let text = '阿尔卑斯欢乐中国人阿迪达斯胡歌阿尔卑斯欢乐中国人阿迪达斯阿尔卑斯胡歌';

console.log(oops.divide(text));
console.log(oops.subdvd(text));

let content = text;
console.log(oops.sense(content));
