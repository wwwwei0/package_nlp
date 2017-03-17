const path = require('path');
const ffi = require('ffi');

const isLinux = (require('os').platform() === 'linux');
const isMac = (require('os').platform() === 'darwin');
// console.log('platform ->', isLinux ? 'linux' : isMac ? 'mac' : 'no linux nor mac');

let source_linux = path.join(__dirname, 'src', 'training_classify_linux.so');
let source_mac = path.join(__dirname, 'src', 'training_classify_mac.dylib');

const sourceName = isLinux ? source_linux : isMac ? source_mac : source_linux;
console.log(sourceName);
const sourcePath = path.join(__dirname);

const trainingClassify = ffi.Library(sourceName, {
  // DEEP_CLASSIFIER_API int DC_Init(const char * sDataPath = 0, int encode = GBK_CODE, int nFeatureCount = FEATURE_COUNT, const char*sLicenceCode = 0);
  'DC_Init': ['int', ['string', 'int', 'int', 'string']],

  // DEEP_CLASSIFIER_API void DC_Exit();
  'DC_Exit': ['bool', []],

  // DEEP_CLASSIFIER_API DC_HANDLE  DC_NewInstance(int nFeatureCount = FEATURE_COUNT);
  'DC_NewInstance': ['int', ['int']],

  // DEEP_CLASSIFIER_API int DC_DeleteInstance(DC_HANDLE handle);
  'DC_DeleteInstance': ['int', ['int']],

  // DEEP_CLASSIFIER_API int DC_AddTrain(const char *sClassName,const char *sText,DC_HANDLE handle=0);
  'DC_AddTrain': ['int', ['string', 'string', 'int']],

  // DEEP_CLASSIFIER_API int DC_AddTrainFile(const char *sClassName,const char *sFilename,DC_HANDLE handle=0);
  'DC_AddTrainFile': ['int', ['string', 'string', 'int']],

  // DEEP_CLASSIFIER_API int DC_Train(DC_HANDLE handle=0);
  'DC_Train': ['int', ['int']],

  // DEEP_CLASSIFIER_API int DC_LoadTrainResult(DC_HANDLE handle=0);
  'DC_LoadTrainResult': ['int', ['int']],

  // DEEP_CLASSIFIER_API int DC_ExportFeatures(const char *sFilename,DC_HANDLE handle = 0);
  'DC_ExportFeatures': ['int', ['string', 'int']],

  // DEEP_CLASSIFIER_API const char * DC_Classify(const char *sText,DC_HANDLE handle=0);
  'DC_Classify': ['string', ['string', 'int']],

  // DEEP_CLASSIFIER_API const char * DC_ClassifyEx(const char *sText, DC_HANDLE handle = 0);
  'DC_ClassifyEx': ['string', ['string', 'int']],

  // DEEP_CLASSIFIER_API const char * DC_ClassifyFile(const char *sFilename,DC_HANDLE handle=0);
  'DC_ClassifyFile': ['string', ['string', 'int']],

  // DEEP_CLASSIFIER_API const char * DC_ClassifyExFile(const char *sFilename, DC_HANDLE handle = 0);
  'DC_ClassifyExFile': ['string', ['string', 'int']],

  // DEEP_CLASSIFIER_API const char * DC_GetLastErrorMsg();
  'DC_GetLastErrorMsg': ['string', []],
});

let isTrainingClassified = false;

/**
 * file encode
 */
const encodes = {
  'GBK_CODE': 0,
  'UTF8_CODE': 1
}

const FEATURE_COUNT = 1000;

module.exports = {
  /**
   * trainingClassify init. the first step of all trainingClassify methods.
   * @method init
   * @param {number|string} [encode=1] - file encode mode.
   * @return {boolean} - init success or error.
   */
  init: function (encode = 1) {
    try {
      if (isTrainingClassified) {
        console.error('trainingClassify already init.');
        return true;
      } else {
        isTrainingClassified = true;
        encode = encodes[encode] !== undefined ? encodes[encode] : encode;
        if (encode > 4 || encode < 0 || typeof encode !== 'number') {
          throw new Error('encode is error.');
        }
        let status = trainingClassify.DC_Init(sourcePath, encode, FEATURE_COUNT, '');
        if (!status) {
          throw new Error('user license maybe expired.');
        }
        return !!status;
      }
    } catch (error) {
      console.error('trainingClassify init error. no concurrency.');
      console.error(error);
      return false;
    }
  },
  /**
   * trainingClassify exit. the last step of all trainingClassify methods.
   * @method exit
   * @param {null}
   * @return {boolean} - exit success or error.
   */
  exit: function () {
    try {
      if (!isTrainingClassified) {
        console.error('trainingClassify not init.');
        return false;
      } else {
        isTrainingClassified = false;
        let status = trainingClassify.DC_Exit();
        return status;
      }
    } catch (error) {
      console.error('trainingClassify exit error.');
      console.error(error);
      return false;
    }
  }
}