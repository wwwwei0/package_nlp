# [natural language processing](https://www.npmjs.com/package/nlp_sf)  

## description  
  > Nodejs环境下自然语言处理工具，包含分词标注，情感分析等。  

## simple to use  
  ```
  let {oops} = require('nlp_sf');
  console.log(oops.divide('这是待分词文本，调用oops接口直接分词并且统计词频。'))
  ```

## installation  
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
  +--index.js----原生nlpir接口  
  |  
  |  
  +--oops.js----封装oops接口  
  |  
  |  
  +--package.json  
  |  
  |  
  +--readme.md  
  
## api  

  -- [nlpir](###nlpir)  
  -- [oops](###oops)  

### nlpir  
  * description  
  > 原生自然语言处理工具，包含分词标注，情感分析等。  

### oops  
  * description  
  > 封装自然语言处理工具，包含分词并统计词频，情感分析等。  