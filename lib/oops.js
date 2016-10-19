let fs = require('fs');
let path = require('path');
let iconv = require('iconv-lite');

let nlp = require('./nlpir.js');
let {ictclas} = nlp;

/**
 * 修改配置文件
 */
let alterConfig = function (bool) {
  let configPath = path.join(__dirname, 'ictclas', 'Data', 'Configure.xml');
  let config = fs.readFileSync(configPath);
  config = iconv.decode(config, 'gbk');
  if(bool){
    config = config.replace('<UserDictPrior>Off</UserDictPrior>', '<UserDictPrior>on</UserDictPrior>');
  }else{
    config = config.replace('<UserDictPrior>on</UserDictPrior>', '<UserDictPrior>Off</UserDictPrior>');
  }
  config = iconv.encode(config, 'gbk');
  fs.writeFileSync(configPath, config);
}

module.exports = {
  divide: function (params) {
    /**
     * @param text {object}  待分词文本
     * @param dict {object}  添加用户词
     * @param block {object} 屏蔽用户词
     * @param query {object} 参数过滤返回
     */
    let {text, dict, block, query} = params;
    /**
     * @param userDict {string} 用户词典
     * @param userWord {array} 用户词语
     */
    let userDict, userWord,
      /**
       * @param freq {number} 词频
       * @param top {number} 排序
       * @param tags {array} 词性
       * @param len {number} 词长
       * @param weight {boolean} 权重
       */
      freq = 0, top = 100, tags = ['n', 'a'], len = 1, weight = false;
    if(dict){
      ({userDict, userWord} = dict);
    }
    if(block){
      // ({importBD, importBW, saveBD} = block);
    }
    if(query){
      ({freq, top, tags, len, weight} = query);
    }
    if(userWord && userWord.length > 0){
      alterConfig(true);
    }else{
      alterConfig(false);
    }
    ictclas.init();
    if(userDict){
      ictclas.importUserDict(userDict);
    }
    if(userWord && userWord.length > 0){
      userWord.map(function (userWord) {
        ictclas.addUserWord(userWord);
      })
    }
    let str_result = ictclas.paragraphProcess(text);
    ictclas.exit();
    let arr_result = str_result.split(/\s+/);
    let obj_result = {};
    let keys = [];
    arr_result.map(function (str) {
      let pos = str.lastIndexOf('/');
      let word = str.substring(0, pos);
      let tag = str.substring(pos + 1);
      if(word.length > len){
        if(keys.includes(word)){
          obj_result[word]++;
        }else{
          tags.map(function (_tag) {
            if(tag.startsWith(_tag)){
              obj_result[word] = 1;
              keys.push(word);
              return;
            }
          })
        }
      }
    });
    let result = [];
    for(let key in obj_result){
      if(obj_result[key] > freq){
        result.push([key, obj_result[key]]);
      }
    }
    let arr_len = result.length;
    for(let i = 1; i < arr_len; i++){
      let max =result[i - 1][1],
        index = i - 1;
      for(let j = i; j < arr_len; j++){
        if(result[j][1] > max){
          max = result[j][1];
          index = j;
        }
      }
      let temp = result[i - 1];
      result[i - 1] = result[index];
      result[index] = temp;
    }
    result = result.slice(0, top);
    return result;
  }
}