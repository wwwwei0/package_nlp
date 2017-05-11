/**
 * 更新字典
 */

let {
  ictclas
} = require('../lib/nlpir.js');
let path = require('path');
let fs = require('fs');

console.log('start update dict.');

let lib = path.join(__dirname, '..', 'lib');
ictclas.init();

// # 字典初始化
let auth = path.join(lib, 'auth.txt');
ictclas.importUserDict(auth, true);

// # 更新字典
let dictp = path.join(lib, 'dicts');
let dicts = fs.readdirSync(dictp);
dicts.map((dict) => {
  console.log(dict);
  let dictf = path.join(dictp, dict);
  let res = ictclas.importUserDict(dictf, false);
  console.log(res);
})
ictclas.exit();
console.log(`update dicts over.`);
