let ffi = require('ffi');

let isLinux = (require('os').platform() === 'linux');

let ictclas;

if(isLinux){
  ictclas = ffi.Library('./lib/ictclas/src/libNLPIR.so', {
    // NLPIR_API int NLPIR_Init(const char * sDataPath=0,int encode=GBK_CODE,const char*sLicenceCode=0);
    'NLPIR_Init': ['int', ['string', 'int', 'string']],

    // NLPIR_API bool NLPIR_Exit();
    'NLPIR_Exit': ['bool', []],

    // NLPIR_API const char * NLPIR_ParagraphProcess(const char *sParagraph,int bPOStagged=1);
    'NLPIR_ParagraphProcess': ['string', ['string', 'int']],

    // NLPIR_API const char * NLPIR_GetLastErrorMsg();
    'NLPIR_GetLastErrorMsg': ['string', []],

    // NLPIR_API const result_t * NLPIR_ParagraphProcessA(const char *sParagraph,int *pResultCount,bool bUserDict=true);
    'NLPIR_ParagraphProcessA': ['string', ['string', 'int', 'bool']],
    
    // NLPIR_API unsigned int NLPIR_ImportUserDict(const char *sFilename,bool bOverwrite=false);
    'NLPIR_ImportUserDict': ['int', ['string', 'bool']],

    // NLPIR_API int NLPIR_SaveTheUsrDic();
    'NLPIR_SaveTheUsrDic': ['int', []],

    // NLPIR_API int NLPIR_AddUserWord(const char *sWord);
    'NLPIR_AddUserWord': ['int', ['string']],

    // NLPIR_API int NLPIR_GetParagraphProcessAWordCount(const char *sParagraph);
    'NLPIR_GetParagraphProcessAWordCount': ['int', ['string']],

    // NLPIR_API void NLPIR_ParagraphProcessAW(int nCount,result_t * result);
    // 'NLPIR_ParagraphProcessAW': [],

    // NLPIR_API double NLPIR_FileProcess(const char *sSourceFilename,const char *sResultFilename,int bPOStagged=1);
    'NLPIR_FileProcess': ['double', ['string', 'string', 'int']],

    // NLPIR_API int NLPIR_SetPOSmap(int nPOSmap);
    'NLPIR_SetPOSmap': ['int', ['int']],

    // NLPIR_API const char * NLPIR_GetWordPOS(const char *sWord);
    'NLPIR_GetWordPOS': ['string', ['string']],

    // NLPIR_API const char*  NLPIR_WordFreqStat(const char *sText);
    'NLPIR_WordFreqStat': ['string', ['string']],

    // NLPIR_API const char*  NLPIR_FileWordFreqStat(const char *sFilename);
    'NLPIR_FileWordFreqStat': ['string', ['string']],
  });
}

let isInited = false;

const encodes = {
  'GBK_CODE': 0,
  'UTF8_CODE': 1,
  'BIG5_CODE': 2,
  'GBK_FANTI_CODE': 3,
  'UTF8_FANTI_CODE': 4
}

const tagSets = {
  'ICT_POS_MAP_FIRST': 0,
  'ICT_POS_MAP_SECOND': 1,
  'PKU_POS_MAP_SECOND': 2,
  'PKU_POS_MAP_FIRST': 3
}

module.exports = {
  /**
   * 分词工具初始化
   */
  init: function (encode = 1) {
    try {
      if(isInited){
        console.error('ictclas already init.');
        return 1;
      }else{
        encode = encodes[encode] !== undefined ? encodes[encode] : encode;
        if(encode > 4 || encode < 0 || typeof encode !== 'number'){
          throw new Error('encode is error.');
        }
        let retval = ictclas.NLPIR_Init('./lib/ictclas', encode, '');
        isInited = true;
        console.error('ictclas init success.');
        return retval;
      }
    } catch (error) {
      console.error('ictclas init error.');
      console.error(error);
      return -1;
    }
  },
  /**
   * 退出分词工具
   */
  exit: function () {
    try {
      if(!isInited){
        return 1;
      }else{
        let retval = ictclas.NLPIR_Exit();
        isInited = false;
        console.error('ictclas exit success.');
        return retval;
      }
    } catch (error) {
      console.error('ictclas exit error.');
      console.error(error);
      return -1;
    }
  },
  /**
   * 导入用户自定义词典
   */
  importUserDict: function (userDict, bool = false) {
    try {
      if(!isInited){
        console.log('no init...');
        return 0;
      }else{
        let retval = ictclas.NLPIR_ImportUserDict(userDict, bool);
        return retval;
      }
    } catch (error) {
      console.error('ictclas importUserDict error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * 保存用户自定义词典
   */
  saveUserDict: function () {
    try {
      if(!isInited){
        console.log('no init...');
        return 0;
      }else{
        let retval = ictclas.NLPIR_SaveTheUsrDic();
        return retval;
      }
    } catch (error) {
      console.error('ictclas saveUserDict error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * 添加用户自定义词语
   */
  addUserWord: function (userWord) {
    try {
      if(!isInited){
        console.log('no init...');
        return 0;
      }else{
        let retval = ictclas.NLPIR_AddUserWord(userWord);
        return retval;
      }
    } catch (error) {
      console.error('ictclas addUserWord error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * 对文本进行分词
   */
  paragraphProcess: function (paragraph, pos = 1) {
    try {
      if(!isInited){
        console.log('no init...');
        return 0;
      }else{
        let retval = ictclas.NLPIR_ParagraphProcess(paragraph, pos);
        return retval;
      }
    } catch (error) {
      console.error('ictclas paragraphProcess error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * not done
   */
  // paragraphProcessA: function (paragraph, result, bool = true) {
  //   try {
  //     if(!isInited){
  //       console.log('no init...');
  //       return 0;
  //     }else{
  //       let retval = ictclas.NLPIR_ParagraphProcessA(paragraph, result, bool);
  //       return retval;
  //     }
  //   } catch (error) {
  //     console.error('ictclas paragraphProcessA error.');
  //     console.error(error);
  //     return 0;
  //   }
  // },
  /**
   * 对文件进行分词
   * fileName,resultName都是相对程序根目录的路径
   */
  fileProcess: function (fileName, resultName, pos = 0) {
    try {
      if(!isInited){
        console.log('no init...');
        return 0;
      }else{
        let retval = ictclas.NLPIR_FileProcess(fileName, resultName, pos);
        console.log('file "', fileName, '" process success.');
        return retval;
      }
    } catch (error) {
      console.error('ictclas fileProcess error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * 分词总数
   */
  getParagraphProcessAWordCount: function (paragraph) {
    try {
      if(!isInited){
        console.log('no init...');
        return 0;
      }else{
        let retval = ictclas.NLPIR_GetParagraphProcessAWordCount(paragraph);
        return retval;
      }
    } catch (error) {
      console.error('ictclas getParagraphProcessAWordCount error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * 最近一条未捕获错误信息
   */
  getLastErrorMsg: function () {
    try {
      if(!isInited){
        console.log('no init...');
        return;
      }else{
        let retval = ictclas.NLPIR_GetLastErrorMsg();
        return retval;
      }
    } catch (error) {
      console.error('ictclas getLastErrorMsg error.');
      console.error(error);
      return;
    }
  },
  /**
   * 设置标注集
   */
  setTagSet: function (tagSet = 0) {
    try {
      if(!isInited){
        console.log('no init...');
        return;
      }else{
        tagSet = tagSets[tagSet] !== undefined ? tagSets[tagSet] : tagSet;
        if(tagSet > 3 || tagSet < 0 || typeof tagSet !== 'number'){
          throw new Error('tagSet is error.');
        }
        let retval = ictclas.NLPIR_SetPOSmap(tagSet);
        return retval;
      }
    } catch (error) {
      console.error('ictclas setTagSet error.');
      console.error(error);
      return;
    }
  },
  /**
   * 文本分词按词频排序
   */
  getWordFreqStat: function (paragraph) {
    try {
      if(!isInited){
        console.log('no init...');
        return;
      }else{
        let retval = ictclas.NLPIR_WordFreqStat(paragraph);
        return retval;
      }
    } catch (error) {
      console.error('ictclas getWordFreqStat error.');
      console.error(error);
      return;
    }
  },
  /**
   * 文件分词按词频排序
   */
  getFileWordFreqStat: function (filepath) {
    try {
      if(!isInited){
        console.log('no init...');
        return;
      }else{
        let retval = ictclas.NLPIR_FileWordFreqStat(filepath);
        return retval;
      }
    } catch (error) {
      console.error('ictclas getFileWordFreqStat error.');
      console.error(error);
      return;
    }
  },
  // /**
  //  * oops api
  //  * this
  //  */
  // oops: function (text, dict, block, query) {
  //   try {
  //     if(!isInited){
  //       console.log('no init...');
  //       return;
  //     }else{
  //       let retval = this.getWordFreqStat(text);
  //       return retval;
  //     }
  //   } catch (error) {
  //     console.error('ictclas getFileWordFreqStat error.');
  //     console.error(error);
  //     return;
  //   }
  // },
}
