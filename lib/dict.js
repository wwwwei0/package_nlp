/**
 * generate user dict from lexical folder, and save to dict folder
 */
const fs = require('fs');
const path = require('path');

/**
 * .yml => dict {keyword: sentiment}
 */
const formatFile = function (filepath) {
  let dict = {};
  const lexi = fs.readFileSync(filepath, 'utf-8')
  const lexis = lexi.split('\n\n').filter(function (_lexi) {
    return _lexi.trim();
  });
  lexis.map(function (_lexi) {
    let obj = {};
    let _lexis = _lexi.split(/:\n\s+-\s*/);
    let sent = _lexis[0].indexOf(':') === 0 ? _lexis[0].slice(1) : _lexis[0];
    let words = _lexis[1].split(/\n\s+-\s*/);
    words.map(function (word) {
      obj[word] = sent;
    })
    dict = Object.assign(dict, obj);
  })
  return dict;
}

/**
 * merge all dict
 * dict => {keyword: sentiment}
 */
const mergeFolder = function () {
  let dict = {};
  const folder = path.join(__dirname, './lexical/');
  if(!path.isAbsolute(folder) || !fs.existsSync(folder)){
    console.log('input folder', folder, 'is not exists...');
    return ;
  }
  const files = fs.readdirSync(folder).filter(function (file) {
    return path.extname(file) === '.yml';
  });
  files.map(function (file) {
    let filepath = path.join(folder, file);
    dict = Object.assign(dict, formatFile(filepath));
  })
  return dict;
}

/**
 * divide all dict
 * dict => {filename: {keyword: sentiment}}
 */
const divideFolder = function () {
  let dict = {};
  const folder = path.join(__dirname, './lexical/');
  const files = fs.readdirSync(folder).filter(function (file) {
    return path.extname(file) === '.yml';
  });
  files.map(function (file) {
    let filepath = path.join(folder, file);
    let filedict = formatFile(filepath);
    dict[file] = filedict;
  })
  return dict;
}

/**
 * write dict to file
 * dict {keyword: sentiment} => txt "keyword sentiment"
 */
const writeDict = function (dict) {
  let folder = path.join(__dirname, './dict/');
  if(!path.isAbsolute(folder) || !fs.existsSync(folder)){
    console.log('output folder', folder, 'is not exists...');
    fs.mkdirSync(folder);
    console.log('create output folder', folder, 'success...');
  }
  let status = false;
  for(let key in dict){
    if(path.extname(key) === '.yml'){
      status = true;
    }
  }
  if(status){
    // divideFolder dict
    for(let file in dict){
      let map = JSON.stringify(dict[file]).split(/["|\{|\}]/).join('').replace(/:/g, ' ').replace(/,/g, '\r\n');
      file = path.basename(file, '.yml') + '.txt';
      let filepath = path.join(folder, file)
      fs.writeFileSync(filepath, map);
    }
  }else{
    // mergeFolder dict
    let map = JSON.stringify(dict).split(/["|\{|\}]/).join('').replace(/:/g, ' ').replace(/,/g, '\r\n');
    let filepath = path.join(folder, 'sentDict.txt');
    fs.writeFileSync(filepath, map);
  }
  console.log('已更新正负词典...');
}

/**
 * read dict from sentDict.txt
 * txt "keyword sentiment" => dict {keyword: sentiment}
 * 
 */
const readDict = function () {
  let dict = {};
  let file = path.join(__dirname, 'dict', 'sentDict.txt');
  let ksmaps;
  try {
    ksmaps = fs.readFileSync(file, 'utf-8').split('\r\n');
  } catch (error) {
    console.log(error);
    console.log(file, 'not exists...');
    console.log('exec oops.updateDict() create sentDict...');
    process.exit(1);
  }
  ksmaps.map(function (_map) {
    let maps = _map.split(/\s+/);
    dict[maps[0]] = maps[1];
  })
  console.log('已读取正负词典...');
  return dict;
}

module.exports = {
  mergeFolder,
  divideFolder,
  writeDict,
  readDict
}
