# natural language processing  

## description  
  > the Natural Language Processing tools under the nodeJs running time, including Chinese word segmentation, sentiment analysis and so on.  

## simple to use  
  ```
  let {oops} = require('nlp_sf');
  console.log(oops.divide('这是待分词文本，调用oops接口直接分词并且统计词频。'));
  ```

## [installation](https://www.npmjs.com/package/nlp_sf)  
  ```
  npm install nlp_sf
  ```

## file structure  
  |  
  |  
  +--lib----系统支持库  
  |  
  |  
  +--assets----测试文件  
  |  
  |  
  +--examples----测试程序  
  |  
  |  
  +--index.js----程序入口  
  |  
  |  
  +--package.json  
  |  
  |  
  +--readme.md  
  
## api  

  - [nlpir](#nlpir)  
  - [oops](#oops)  

### nlpir  
  **description**  
  > the native Natural Language Processing tools.  

  **loading**  
  first you need to load nlpir. this is the preferred method:  
  ```
  let nlp = require('nlp_sf');
  let {nlpir} = nlp;
  ```

  optionally, you also can load nlpir by the method:  
  ```
  let {nlpir} = require('nlp_sf');
  ```

  **.init()**  
  ```
  nlpir.init();
  ```

  **.exit()**  
  ```
  nlpir.exit();
  ```

### oops  
  **description**  
  > the interface of the Natural Language Processing.  

  **loading**  
  first you need to load oops. this is the preferred method:  
  ```
  let nlp = require('nlp_sf');
  let {oops} = nlp;
  ```

  optionally, you also can load oops by the method:  
  ```
  let {oops} = require('nlp_sf');
  ```

  **.divide(params, error)**  
  simply, method to divide a string and return array consist of the top 100 words sort by frequency.  
  default error = false, not throw error.  
  ```
  let arr = oops.divide('这是待分词文本，调用oops接口直接分词并且统计词频。');
  ```

  custom divide params:  
  _**default**_  
  ```
  dict = {},
  query = {
    top: 100,
    freq: 0,
    len: 1,
    join: false,
    tags: ['n', 'a']
  }
  ```
  _set top is -999, export all keywords_  
  _text is either String or array_  
  _[tags](http://ictclas.nlpir.org/nlpir/html/readme.htm#_Toc34628482)_
  ```
  let path = require('path');
  let text = '这是待分词文本，调用oops接口直接分词并且统计词频。';
  let userDict = '../assets/userDict.txt';
  userDict = path.join(__dirname, userDict);
  let dict = {
    userDict: userDict,
    userWord: ['两国关系 n']
  };
  let query = {
    top: 20,
    freq: 0,
    len: 1,
    join: true,
    tags: ['n']
  };
  let params = {
    text: text,
    dict: dict,
    query: query
  }
  let arr = oops.divide(params);
  ```

  **.sense(params)**  
  simply, method to sense a string and return object consist of positive point and negative point.  
  ```
  let arr = oops.sense('这是待情感分析文本，调用oops接口分析并且返回情感分析结果。');
  ```

  custom sense params:  
  ```
  let path = require('path');
  let title = '情感分析';
  let content = '这是待情感分析文本，调用oops接口分析并且返回情感分析结果。';
  let target = '情感';
  let userDict = '../assets/userDict.txt';
  userDict = path.join(__dirname, userDict);
  let params = {
    content: content,
    target: target,
    title: title,
    userDict: title
  }
  let obj = oops.sense(params);
  ```

  **.distinguish(array)**  
  first update dict, second use distinguish  
  folder /lib/lexical store .yml dict, updateDict read the .yml dict , and update .txt dict store /lib/dict folder  
  ```
  let arr = oops.divide(params);
  oops.updateDict();
  console.log(oops.distinguish(arr));
  ```

  **.divdis(params)**  
  divide + distinguish  
  first update dict, second use divdis  
  folder /lib/lexical store .yml dict, updateDict read the .yml dict , and update .txt dict store /lib/dict folder  
  ```
  oops.updateDict();
  console.log(oops.divdis(arr));
  ```
