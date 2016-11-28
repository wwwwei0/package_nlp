const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const xml2json = require('xml2json');

const nlp = require('./nlpir.js');
const {ictclas, sentiment} = nlp;
const dict = require('./dict.js');

const reg = 'LJSentiment-Result';

/**
 * consider the user dict to be a priority
 * @method modifyConfig
 * @param {string} folder - configure xml
 * @param {boolean} bool - yes or not
 */
let modifyConfig = function (folder, bool) {
  let configPath = path.join(__dirname, folder, 'Data', 'Configure.xml');
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
  /**
   * divide word
   * @method divide
   * @param params {string|object} - text or text options
   */
  divide: function (params) {
    if(typeof params !== 'object' && typeof params !== 'string'){
      throw new Error('params format error, pass params by object, array or string.');
    }
    if(params == null){
      throw new Error('params format error, pass params by object, array or string.');
    }
    /**
     * @param {string|array} text -  待分词文本
     * @param {object} [dict] -  添加用户词
     * @param {object} [block] - 屏蔽用户词
     * @param {object} [query] - 参数过滤返回
     */
    let {text = params, dict, block, query} = params;
    if(typeof text !== 'string' && !Array.isArray(text)){
      throw new Error('text format error, pass text by string.');
    }
    if(!Array.isArray(text)){
      text = [text];
    }
    let reg = /'/g
    text = text.map(_text => {
      return _text.replace(reg, ' ')
    })

    /**
     * @param {string} [userDict] - 用户词典，只支持绝对路径
     * @param {array} [userWord] - 用户词语
     */
    let userDict, userWord,
      /**
       * @param {number} [freq] - 词频
       * @param {number} [top] - 排序
       * @param {array} [tags] - 词性
       * @param {number} [len] - 词长
       * @param {boolean} [join] - 合并
       * @param {boolean} [weight] - 权重
       */
      freq = 0, top = 100, tags = ['n', 'a'], len = 1, join = false, weight = false;
    if(dict){
      ({userDict, userWord} = dict);
    }
    if(block){
      // ({importBD, importBW, saveBD} = block);
    }
    if(query){
      ({freq = 0, top = 100, tags = ['n', 'a'], len = 1, join = false, weight = false} = query);
    }
    if(userWord && userWord.length > 0){
      modifyConfig('ictclas', true);
    }else{
      modifyConfig('ictclas', false);
    }
    if(join){
      text = [text.join('')];
    }
    ictclas.init();
    if(userDict){
      let status = ictclas.importUserDict(userDict);
      if(status){
        console.log('userDict', userDict, 'import success.');
      }else{
        console.log('userDict', userDict, 'import error.');
      }
    }
    if(userWord && userWord.length > 0){
      userWord.map(function (_userWord) {
        ictclas.addUserWord(_userWord);
      })
    }
    let str_result = text.map(_text => ictclas.paragraphProcess(_text)).join(' ');
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
        }else if(tags.length === 0){
          obj_result[word] = 1;
          keys.push(word);
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
    result = top === 0 ? result : result.slice(0, top);
    return result;
  },
  /**
   * sentiment interface
   * @method sense
   * @param params {string|object} - content or content options
   * @return {object} - polarity and positivepoint and negativepoint
   */
  sense: function (params) {
    let xml_result, json_result, result;
    if(typeof params !== 'object' && typeof params !== 'string'){
      throw new Error('params format error, pass params by object or string.');
    }else if(typeof params === 'string'){
      sentiment.init();
      xml_result = sentiment.getSentencePoint(params);
      sentiment.exit();
      try {
        json_result = JSON.parse(xml2json.toJson(xml_result));
      } catch (error) {
        console.log(error);
        return;
      }
      let polarity = json_result[reg].result.polarity - 0;
      let positivepoint = json_result[reg].result.positivepoint - 0;
      let negativepoint = json_result[reg].result.negativepoint - 0;
      return {
        polarity,
        positivepoint,
        negativepoint
      }
    }else{
      /**
       * @param {string} content -  待分析内容
       * @param {string} [target] - 待分析对象
       * @param {object} [title] - 待分析标题
       * @param {string} [userDict] - 用户词典
       */
      let {content, target, title, userDict} = params;
      userDict ? modifyConfig('sentiment', true) : modifyConfig('sentiment', false);
      sentiment.init();
      userDict ? sentiment.importUserDict(userDict) : undefined;
      xml_result = target ? sentiment.getOneObjectResult(target, content, title) : sentiment.getSentencePoint(content);
      sentiment.exit();
      try {
        json_result = JSON.parse(xml2json.toJson(xml_result));
      } catch (error) {
        console.log(error);
        return;
      }
      let polarity = json_result[reg].result.polarity - 0;
      let positivepoint = json_result[reg].result.positivepoint - 0;
      let negativepoint = json_result[reg].result.negativepoint - 0;
      return target ? {
        target,
        polarity,
        positivepoint,
        negativepoint
      } : {
        polarity,
        positivepoint,
        negativepoint
      }
    }
  },
  /**
   * update sentiment dict
   */
  updateDict: function (params) {
    let userdict = dict.mergeFolder();
    dict.writeDict(userdict);
  },
  /**
   * distinguish the result from divide word
   * firstly update sentiment dict
   */
  distinguish: function (maps) {
    let distinction = {};
    const dicts = dict.readDict();
    maps.map(function (_map) {
      let value = dicts[_map[0]]
      if(value){
        Array.isArray(distinction[value]) ? distinction[value].push(_map) : distinction[value] = [_map];
      }
    })
    return distinction;
  },
  /**
   * divide and distinguish
   * firstly update sentiment dict
   */
  divdis: function (params) {
    let divs = this.divide(params);
    let diss = this.distinguish(divs);
    return {
      divs,
      diss
    }
  }
}