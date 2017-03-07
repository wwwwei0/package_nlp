const path = require('path');
const ffi = require('ffi');

const isLinux = (require('os').platform() === 'linux');
const isMac = (require('os').platform() === 'darwin');
// console.log('platform ->', isLinux ? 'linux' : isMac ? 'mac' : 'no linux nor mac');

let source_linux = path.join(__dirname, 'src', 'libNLPIR_linux.so');
let source_mac = path.join(__dirname, 'src', 'libNLPIR_mac.dylib');

const sourceName = isLinux ? source_linux : isMac ? source_mac : source_linux;
const sourcePath = path.join(__dirname);



// './lib/ictclas/src/libNLPIR.so'
const ictclas = ffi.Library(sourceName, {
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

let isICTCLASInited = false;

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

/**
 * word tag sets
 */
const tagSets = {
  'ICT_POS_MAP_FIRST': 0,
  'ICT_POS_MAP_SECOND': 1,
  'PKU_POS_MAP_SECOND': 2,
  'PKU_POS_MAP_FIRST': 3
}

module.exports = {
  /**
   * ictclas init. the first step of all ictclas methods.
   * @method init
   * @param {number|string} [encode=1] - file encode mode.
   * @return {boolean} - init success or error.
   */
  init: function (encode = 1) {
    try {
      if (isICTCLASInited) {
        console.error('ictclas already init.');
        return true;
      } else {
        isICTCLASInited = true;
        encode = encodes[encode] !== undefined ? encodes[encode] : encode;
        if (encode > 4 || encode < 0 || typeof encode !== 'number') {
          throw new Error('encode is error.');
        }
        let status = ictclas.NLPIR_Init(sourcePath, encode, '');
        if (!status) {
          throw new Error('user license maybe expired.');
        }
        // console.log('ictclas init success.');
        return !!status;
      }
    } catch (error) {
      console.error('ictclas init error. no concurrency.');
      console.error(error);
      return false;
    }
  },
  /**
   * ictclas exit. the last step of all ictclas methods.
   * @method exit
   * @param {null}
   * @return {boolean} - exit success or error.
   */
  exit: function () {
    try {
      if (!isICTCLASInited) {
        console.error('ictclas not init.');
        return false;
      } else {
        isICTCLASInited = false;
        let status = ictclas.NLPIR_Exit();
        // console.log('ictclas exit success.');
        return status;
      }
    } catch (error) {
      console.error('ictclas exit error.');
      console.error(error);
      return false;
    }
  },
  /**
   * import user custom dictionary.
   * @method importUserDict
   * @param {string} userDict - the absolute path of user custom dictionary.
   * @param {boolean} [bool=false] - true represent total add, false represent incremental add.
   * @return {boolean} - import success or error.
   */
  importUserDict: function (userDict, bool = false) {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
        return false;
      } else {
        let status = ictclas.NLPIR_ImportUserDict(userDict, bool);
        if (!status) {
          throw new Error('pass user custom dictionary abslute path.');
        }
        // console.log('import user custom dictionary success.');
        return !!status;
      }
    } catch (error) {
      console.error('ictclas importUserDict error.');
      console.error(error);
      return false;
    }
  },
  /**
   * save user dictionary.
   */
  saveUserDict: function () {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
        return 0;
      } else {
        let status = ictclas.NLPIR_SaveTheUsrDic();
        return status;
      }
    } catch (error) {
      console.error('ictclas saveUserDict error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * add user custom word.
   * @method addUserWord
   * @param {string} userWord - user custom word.
   * @return null
   */
  addUserWord: function (userWord) {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
      } else {
        ictclas.NLPIR_AddUserWord(userWord);
      }
    } catch (error) {
      console.error('ictclas addUserWord error.');
      console.error(error);
    }
  },
  /**
   * ictclas process paragraph.
   * @method paragraphProcess
   * @param {string} paragraph - the paragraph to word.
   * @param {boolean} [bool=true] - display or not display lexical features.
   * @return {string} - word results.
   */
  paragraphProcess: function (paragraph, bool = true) {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
        return;
      } else {
        if (typeof bool !== 'boolean') {
          throw new Error('pass boolean data.');
        }
        let result;
        if (bool) {
          result = ictclas.NLPIR_ParagraphProcess(paragraph, 1);
        } else {
          result = ictclas.NLPIR_ParagraphProcess(paragraph, 0);
        }
        return result;
      }
    } catch (error) {
      console.error('ictclas paragraphProcess error.');
      console.error(error);
      return;
    }
  },
  /**
   * ictclas process file.
   * @method fileProcess
   * @param {string} filePath - the absolute file path to word.
   * @param {string} resultPath - the absolute file path to save result.
   * @return {boolean} - process file success or error.
   */
  fileProcess: function (filePath, resultPath, pos = 0) {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
        return false;
      } else {
        let status = ictclas.NLPIR_FileProcess(filePath, resultPath, pos);
        if (!status) {
          throw new Error('file path and result path are absolute path.');
        }
        // console.log('file "', filePath, '" process success.');
        // console.log('result save at ', resultPath);
        return !!status;
      }
    } catch (error) {
      console.error('ictclas fileProcess error.');
      console.error(error);
      return false;
    }
  },
  /**
   * count word the paragraph.
   * @method getParagraphProcessAWordCount.
   * @param {string} paragraph - the paragraph to word.
   * @return {number} count - count words.
   */
  getParagraphProcessAWordCount: function (paragraph) {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
        return 0;
      } else {
        let count = ictclas.NLPIR_GetParagraphProcessAWordCount(paragraph);
        return count;
      }
    } catch (error) {
      console.error('ictclas getParagraphProcessAWordCount error.');
      console.error(error);
      return 0;
    }
  },
  /**
   * catch last error message.
   * @method getLastErrorMsg
   * @param null
   * @return {string} - last error message.
   */
  getLastErrorMsg: function () {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
        return;
      } else {
        return ictclas.NLPIR_GetLastErrorMsg();
      }
    } catch (error) {
      console.error('ictclas getLastErrorMsg error.');
      console.error(error);
      return;
    }
  },
  /**
   * set word tag sets
   * @method setTagSet
   * @param {number} [tagSet=0] - word tag set.
   * @return null
   */
  setTagSet: function (tagSet = 0) {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
      } else {
        tagSet = tagSets[tagSet] !== undefined ? tagSets[tagSet] : tagSet;
        if (tagSet > 3 || tagSet < 0 || typeof tagSet !== 'number') {
          throw new Error('tagSet is error.');
        }
        ictclas.NLPIR_SetPOSmap(tagSet);
      }
    } catch (error) {
      console.error('ictclas setTagSet error.');
      console.error(error);
    }
  },
  /**
   * word sort from paragraph by frequence.
   * @method getWordFreqStat
   * @param {string} paragraph - the paragraph to word.
   * @return {string} stat - word sort by frequence.
   */
  getWordFreqStat: function (paragraph) {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
        return;
      } else {
        let stat = ictclas.NLPIR_WordFreqStat(paragraph);
        return stat;
      }
    } catch (error) {
      console.error('ictclas getWordFreqStat error.');
      console.error(error);
      return;
    }
  },
  /**
   * word sort from file by frequence.
   * @method getFileWordFreqStat
   * @param {string} filepath - the absolute file path to word.
   * @return {string} stat - word sort by frequence.
   */
  getFileWordFreqStat: function (filepath) {
    try {
      if (!isICTCLASInited) {
        console.error('no init...');
        return;
      } else {
        let stat = ictclas.NLPIR_FileWordFreqStat(filepath);
        if (!stat) {
          throw new Error('file path error or not contain contents.')
        }
        return stat;
      }
    } catch (error) {
      console.error('ictclas getFileWordFreqStat error.');
      console.error(error);
      return;
    }
  }
}