
一直以为学好一个东西最好的方法，就是实现它，接下来就会一步步实现express

<!--more-->

## 预备知识

1、Object.assign(target，....source)

通过调用该函数可以copy所有可被枚举(enumerable:true)的自有属性(不包括  __proto__)到目标对象中。

2、 Function.apply(obj，args)

obj：这个对象将代替Function类里this对象

args：这个是数组，它将作为参数传给Function。

使用apply可以改变程序执行的上下文，控制传参的个数，灵活性更好。

3、函数添加属性和方法

js 中函数其实是引用类型，可以随意添加属性和方法。

```
var app = function() {}
app.a = '11';
app.b = '22';
```

上面例子app可以作为一个函数直接执行app()，同时也可以用app.a这样得到它的属性。

## 流程


先要创建一个简单的express应用

```
let express = require('./express');
let app = express();

app.listen(3000, function () {
    console.log('the server is listening:' ,3000);
});
```

### require('./express')

当require('./express')，实际上是require('./lib/express');，这是express的入口，查看express.js

```
exports = module.exports = createApplication;

let application = require('./application');

function createApplication() {
    let app = function (req, res, next) {
        res.writeHead('200', {'Content-Type': 'text-plain'});
        res.end('hello world\n');
    }
    Object.assign(app, application);
    return app;
}
```

所以require('./express')得到的是`createApplication`函数。

### express()

而 let app = express()就是得到app对象，这个对象中也包含application的属性（listen）。

### app.listen()

app.listen实际调用的是application.js

```
app.listen = function listen() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
}
```

这里的this 是express应用中的app，this在这里是作为函数执行，这个函数会添加到服务器的request事件，这样的话，当每个请求到来后，app函数就是处理函数。

return server.listen.apply(server, arguments);  以server 作为上下文，调用listen方法启动服务器。

