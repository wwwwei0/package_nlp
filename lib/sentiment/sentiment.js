const path = require('path');
const ffi = require('ffi');

const isLinux = (require('os').platform() === 'linux');

const sourceName = path.join(__dirname, 'src', 'libSentimentNew.so');
const sourcePath = path.join(__dirname);

let sentiment;

if (isLinux) {
  sentiment = ffi.Library(sourceName, {
    // ST_API int ST_Init(const char * sDataPath=0, int encode=ENCODING_GBK, const char*sLicenceCode=0);
    'ST_Init': ['int', ['string', 'int', 'string']],

    // ST_API int ST_Exit();
    'ST_Exit': ['int', []],

    // ST_API const char * ST_GetOneObjectResult(const char *sTitle, const char *sContent, const char *sObject);
    'ST_GetOneObjectResult': ['string', ['string', 'string', 'string']],

    // ST_API const char * ST_GetLastErrMsg();
    'ST_GetLastErrMsg': ['string', []],

    // ST_API const char * ST_GetMultiObjectResult(const char *sTitle, const char *sContent, const char *sObjectRuleFile);
    'ST_GetMultiObjectResult': ['string', ['string', 'string', 'string']],

    // ST_API int ST_ImportUserDict(const char *sFilePath, int bOverwrite=false);
    'ST_ImportUserDict': ['int', ['string', 'int']],

    // ST_API const char *  ST_GetSentencePoint(const char *sSentence);
    'ST_GetSentencePoint': ['string', ['string']],

    // ST_API double ST_GetSentimentPoint(const char *sSentence);
    'ST_GetSentimentPoint': ['int', ['string']],
  });
}

let isInited = false;

/**
 * file encode
 */
const encodes = {
  'GBK_CODE': 0,
  'UTF8_CODE': 1,
  'BIG5_CODE': 2,
  'GBK_FANTI_CODE': 3,
  'UTF8_FANTI_CODE': 4
}

module.exports = {
  /**
   * sentiment init. the first step of all sentiment methods.
   * @method init
   * @param {number|string} [encode=1] - file encode mode.
   * @return {boolean} - init success or error.
   */
  init: function (encode = 1) {
    try {
      if(isInited){
        console.error('sentiment already init.');
        return false;
      }else{
        encode = encodes[encode] !== undefined ? encodes[encode] : encode;
        if(encode > 4 || encode < 0 || typeof encode !== 'number'){
          throw new Error('encode is error.');
         } 
        let status = sentiment.ST_Init(sourcePath, encode, '');
        if(!status){
          throw new Error('data path', sourcePath, ' is error, or license is error.')
        }
        isInited = true;
        console.log('sentiment init success.');
        return !!status;
      }
    } catch (error) {
      console.error('sentiment init error.');
      console.error(error);
      return false;
    }
  },
  /**
   * sentiment exit. the last step of all sentiment methods.
   * @method exit
   * @param {null}
   * @return {boolean} - exit success or error.
   */
  exit: function () {
    try {
      if(!isInited){
        return false;
      }else{
        let status = sentiment.ST_Exit();
        isInited = false;
        console.log('sentiment exit success.');
        return !!status;
      }  
    } catch (error) {
      console.error('sentiment exit error.');
      console.error(error);
      return false;
    }
  },
  importUserDict: function (userDict, num = 0) {
    try {
      if(!isInited){
        console.log('no init...');
        return 0;
      }else{
        let retval = sentiment.ST_ImportUserDict(userDict, num);
        return retval;
      }
    } catch (error)  {
      console.error('sentiment importUserDict error.');
      console.error(error);
      return 0;
    }
  },
  getSentimentPoint: function (paragraph) {
    try {
      if(!isInited){
        console.log('no init...');
        return 0;
      }else{
        let retval = sentiment.ST_GetSentimentPoint(paragraph);
        return retval;
      }
    } catch (error)  {
      console.error('sentiment getSentimentPoint error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * sentiment paragraph.
   * @method getSentencePoint
   * @param {string} paragraph - the paragraph to sentiment.
   * @return {string} xml - the result xml string.
   */
  getSentencePoint: function (paragraph) {
    try {
      if(!isInited){
        console.log('no init...');
        return;
      }else{
        let xml = sentiment.ST_GetSentencePoint(paragraph);
        return xml;
      }
    } catch (error)  {
      console.error('sentiment getSentencePoint error..');
      console.error(error);
      return;
    }
  },
  /**
   * catch last error message.
   * @method getLastErrorMsg
   * @param {null}
   * @return {string} - last error message.
   */
  getLastErrorMsg: function () {
    try {
      if(!isInited){
        console.log('no init...');
        return;
      }else{
        let msg = sentiment.ST_GetLastErrMsg();
        return msg;
      }
    } catch (error)  {
      console.error('sentiment getLastErrorMsg error.');
      console.error(error);
      return;
    }
  },
  /**
   * sentiment target in paragraph.
   * @method getOneObjectResult
   * @param {string} target - the target to sentiment.
   * @param {string} content - the paragraph content to sentiment.
   * @param {string} [title = ''] - the title of paragraph to sentiment.
   * @return {string} xml - the result xml string.
   */
  getOneObjectResult: function (target, content, title = '') {
    try {
      if(!isInited){
        console.log('no init...');
        return;
      }else{
        let xml = sentiment.ST_GetOneObjectResult(title, content, target);
        return xml;
      }
    } catch (error) {
      console.error('sentiment getOneObjectResult error.');
      console.error(error);
      return;
    }  
  },
  /**
   * sentiment rule in paragraph.
   * @method getMultiObjectResult
   * @param {string} rule - the rule xml string.
   * @param {string} content - the paragraph content to sentiment.
   * @param {string} [title = ''] - the title of paragraph to sentiment.
   * @return {string} xml - the result xml string.
   */
  getMultiObjectResult: function (rule, content, title = '') {
    try {
      if(!isInited){
        console.log('no init...');
        return;
      }else{
        let xml = sentiment.ST_GetMultiObjectResult(title, content, rule);
        return xml;
      }
    } catch (error) {
      console.error('sentiment getMultiObjectResult error.');
      console.error(error);
      return;
    }
  }
}