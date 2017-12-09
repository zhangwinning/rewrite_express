var app = exports = module.exports = {};
var http = require('http');
let slice = Array.prototype.slice;
var Router = require('./router/index');
let methods = ['get'];

//在express中通过Object.assign(app, application); 已经把application的属性全部添加到app上了
app.listen = function listen() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
}

app.lazyrouter = function lazyrouter() {
    if (!this._router) {
        this._router = new Router();
    }
}

app.handle = function handle(req, res, callback) {
    let router = this._router;
    router.handle(req, res, {});
}

// 以下代码会在其他模块require时执行，在app中添加方法，app[method]会在调用路由中间件时执行
methods.forEach(function (method) {
    app[method] = function (path) {
        this.lazyrouter();  //新建一个`router`对象
        let route = this._router.route(path); //新建一个route并添加到刚刚建立的router的stack中，这里实际上是调用的`router`函数
        let handle = slice.call(arguments, 1);
        route[method].apply(route, handle); //为route添加stack
        return this;
    }
});