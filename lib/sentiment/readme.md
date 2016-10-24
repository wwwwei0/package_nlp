# ictclas  

## description  
  > 情感分析，并可在分析过程中，导入用户定义的词典。

## structure  
  |  
  |  
  +--Data----核心词库  
  |  
  |  
  +--src----源文件  
  |  
  |  
  +--sentiment.js----程序文件  
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

  3. importUserDict(filepath, bool)  
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

  4. getSentencePoint(content)  
  > 情感分析  

  5. getOneObjectResult(taget, content, title)  
  > 分析目标情感  

  6. getLastErrorMsg()  
  > 输出最近一条未捕获错误信息  
