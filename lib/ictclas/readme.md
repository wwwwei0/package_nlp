# ictclas  

## description  
  > 分词标注，对原始语料进行分词，自动识别人名、地名、机构名等未登录词，新词标注以及词性标注，并可在分析过程中，导入用户定义的词典。

## structure  
  |  
  |  
  +--Data----核心词库  
  |  
  |  
  +--src----源文件  
  |  
  |  
  +--ictclas.js----程序文件  
  |  
  |  
  +--readme.md  

## api  

  1. init(number)  
  > 初始化  

  > 文件编码  
  ```
  #default  number = 1            //默认UTF8编码
  #define  GBK_CODE           0   //GBK编码
  #define  UTF8_CODE          1   //UTF8编码
  #define  BIG5_CODE          2   //BIG5编码
  #define  GBK_FANTI_CODE     3   //GBK编码，支持繁体字
  #define  UTF8_FANTI_CODE    4   //UTF8编码，支持繁体字
  ```
  
  2. exit()  
  > 退出  

  3. paragraphProcess(paragraph, number)  
  > 文本分词  

  > [词性类别](http://ictclas.nlpir.org/nlpir/html/readme.htm#_Toc34628482)  
  ```
  #default  number = 1    //默认显示词性类型
  number = 0              //不显示词性类型
  ```

  4. fileProcess(filepath, resultpath, number)  
  > 文件分词  

  > 结果文件必须提前创建  

  > [词性类别](http://ictclas.nlpir.org/nlpir/html/readme.htm#_Toc34628482)  
  ```
  #default  number = 1    //默认显示词性类型
  number = 0              //不显示词性类型
  ```

  5. importUserDict(filepath, bool)  
  > 导入用户词典  

  > 词典格式.txt  
  ```
  金鹰节 n
  不明觉厉 user
  ```

  > 是否添加到现有词典  
  ```
  #default false  //默认新增到原来的词典
  #define  false  //新增到原来的词典
  #define  true   //覆盖原来的词典
  ```

  6. addUserWord(word)  
  > 添加用户词  

  > 词语格式  
  ```
  不明觉厉 user
  ```

  7. setTagSet(number)  
  > 设置标注集  
  ```
  #default  number = 0            //默认计算所一级标注集
  #define  ICT_POS_MAP_FIRST   0  //计算所一级标注集
  #define  ICT_POS_MAP_SECOND  1  //计算所二级标注集
  #define  PKU_POS_MAP_SECOND  2  //北大二级标注集
  #define  PKU_POS_MAP_FIRST 	 3  //北大一级标注集
  ```

  8. getWordFreqStat(paragraph)  
  > 文本分词，根据词频排序  

  9. getFileWordFreqStat(filepath)  
  > 文件分词，根据词频排序  

  10. getLastErrorMsg()  
  > 输出最近一条未捕获错误信息  
