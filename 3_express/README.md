## 重写express(三)

继续实现express

### 目标：实现非路由中间件

app.use(myLogger);

### 预备知识

### 流程

```
let express = require('./express');
let app = express();


var myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
}
app.use(myLogger);
app.listen(3002, function () {
    console.log('the server is listening:', 3002);
});

```

非路由中间件指的是使用`app.use(myLogger)`处理中使用的use。

`app.use()`实际调用application.js中的app.use方法，看一下app.use是做了什么事？

1、先通过懒加载实例化一个router对象
2、获取router对象
3、调用router对象的use方法(用app.use代理router.use)

router.use方法中
1、实例化一个layer对象，
2、把layer对象的route属性判定为undefined
3、把layer对象放入栈中

最后请求
请求到来后，直接调用router中的handle函数，遍历router中的stack数组，找到匹配的后进行处理，