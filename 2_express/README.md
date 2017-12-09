## 重写express\(二\)

继续实现express。

### 目标：实现一个路由

app.get('/test', (req, res) => res.send('Hello World!') );

### 预备知识

1、Array.prototype.slice.call(arguments);

把类数组对象转化为数组，并且返回转化后的数组。

```
function foo () {
      console.log(arguments)
      console.log(Array.prototype.slice.call(arguments))
      console.log(Array.prototype.slice.call(arguments, 1))
      console.log(arguments);
}
foo ('hello', 'world')

{ '0': 'hello', '1': 'world' }
[ 'hello', 'world' ]
[ 'world' ]
{ '0': 'hello', '1': 'world' }
```

2、require模块时，Node对模块进行缓存，第二次require时，是不会重复开销的。

3、router、route、layer 区别
  1、router 相当于一个中间件容器，每个应用只会创建一个router
  2、每个路由中间件会对应一个layer对象，而判断路由中间件和普通中间件区别是判断layer.route是否为空

### 流程

```
let express = require('./express');
let app = express();

app.get('/test', (req, res) => res.send('Hello World!'));
app.listen(3001, function () {
    console.log('the server is listening:', 3001);
});
```

路由get的添加分为三板斧

```
1、express()   //为应用添加各种请求方法
2、app.get('/test', (req, res) => {})  // 构建前端请求和后端处理程序的关联
3、createServer(app)  // 请求方法的执行，请求到来后，调用函数app()
```

具体实现

1、执行express后，会在app对象中添加各种请求方法。

2、构建关联

app[method] 函数会在调用路由中间件（例如 app.get(/test)）时执行。

```
methods.forEach(function (method) {
    app[method] = function (path) {
        this.lazyrouter();  //新建一个`router`对象
        let route = this._router.route(path); //新建一个route并添加到刚刚建立的router的stack中，
        这里实际上是调用的`router`函数
        route[method].apply(route, slice.call(arguments, 1)); //为route添加stack
        return this;
    }
});
```
this.lazyrouter();
这个方法会创建router对象，而这个对象会一直绑定到应用的_router属性上，创建的router对象在每个应用中只有一个。
`express.js`中的app对象和这里创建的router对象是结构相似的(router对象本身是个函数，并且添加一些属性)。

let route = this._router.route(path);
先创建一个Route对象，创建layer对象，把layer对象的route属性指向Route对象，把新创建的layer对象放到router的stack中，返回route对象

let handle = slice.call(arguments, 1);
获取处理函数(数组的形式)

route[method].apply(route, handle);
获取处理函数，再次实例化layer对象，并且设置layer.method = get,然后把新创建的layer放到route对象的stack中。

这时路由和后端程序已经关联好了

3、根据请求路由调用具体处理函数

请求来到后，实际上调用的是`application.js`中的handle函数(获取应用的_router属性，实际上是router对象)
----> 调用router.handle() ---->
根据请求的url和第二步中注册的路由路径判断是否是满足，
满足的话，调用相应layer对象中的handle对象进行调用

[项目地址](https://github.com/WenNingZhang/rewrite_express.git)