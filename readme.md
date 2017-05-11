# nlp-oops

## API  

### load  
  ```
  let {oops} = require('oops_sf');
  ```

### divide  
通用分词  

  ```
  let result = oops.divide(text);
  ```

### subdvd  
品牌分词, 品牌包含 tags = ['stars', 'brands', 'films']  

  ```
  let result = oops.subdvd(text);
  ```

### sense  
情感分析  

  ```
  let result = oops.sense(text);
  ```

## 备注  

### LICENSE  
更新授权  

1. divide  
  ```
  ./lib/ictclas/Data
  ```

2. sentiment  
  ```
  ./lib/sentiment/Data
  ```

#### dict  
更新品牌字典, 字典存放在 ./lib/dicts/ 文件夹下  

  ```
  npm run dict
  ```
