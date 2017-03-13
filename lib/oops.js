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
   * @param format {String} - result format: obj/arr
   * @param error {Boolean} - throw error
   * 
   */
  divide: function (params, format = 'arr', error = false) {
    if(typeof params !== 'object' && typeof params !== 'string'){
      console.log(params);
      if(!error){
        console.log('params format error, pass params by object, array or string.');
        return [];
      }
      throw new Error('params format error, pass params by object, array or string.');
    }
    if(params == null){
    console.log(params);
      if(!error){
        console.log('params format error, pass params by object, array or string.');
        return [];
      }
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
      console.log(text);
      if(!error){
        console.log('text format error, pass text by string.');
        return [];
      }
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
    let obj_result = new Map();
    arr_result.map(function (str) {
      let pos = str.lastIndexOf('/');
      let word = str.substring(0, pos);
      let tag = str.substring(pos + 1);
      if(word.length > len){
        if(obj_result.has(word)){
          let num = obj_result.get(word) + 1
          obj_result.set(word, num);
        }else if(tags.length === 0){
          obj_result.set(word, 1);
        }else{
          tags.map(function (_tag) {
            if(tag.startsWith(_tag)){
              obj_result.set(word, 1);
              return;
            }
          })
        }
      }
    });
    if(format === 'obj'){
      // 返回对象格式数据，不排序
      return obj_result;
    }
    let result = [];
    for(let [key, value] of obj_result.entries()){
      if(value > freq){
        result.push([key, value]);
      }
    }
    let arr_len = result.length;
    result.sort(function (first, last) {
      return last[1] - first[1]
    })
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
  },
  subdvd: function (text = 'soonfy', tags = ['stars', 'brands', 'films']) {
    let results = {
      title: '分词',
      text: text,
      tags: tags,
      timestamp: Date.now()
    }
    text += '.'
    tags.map((_tag) => {
      let query = {
        top: 0,
        tags: [_tag]
      }
      let params = {
        text: text,
        query: query
      }
      let words = this.divide(params);
      let keys = {};
      words.map((_word) => {
        keys[_word[0]] = _word[1];
      })
      results[_tag] = keys;
    })
    return results
  }
}