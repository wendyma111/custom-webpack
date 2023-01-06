简易webpack
=
**启动**：yarn build  
**主逻辑**：pack.js  
**打包流程**：  
- 使用@babel/parser将入口文件code解析成ast
- 使用@babel/traverse遍历ast节点，找到模块依赖，使用@babel/core将ast转回code，并进入依赖文件重复以上步骤
- 递归重复以上步骤后，获得模块依赖图以及解析后的模块代码
- 将解析后代码包装进函数中，require、exports作为参数，形成隔离作用域
- 重写require、exports，将执行后的模块导出存入缓存中
- 输出重写后的代码

