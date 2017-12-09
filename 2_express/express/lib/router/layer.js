exports = module.exports = Layer;

let response = require('../response');

function Layer(path, options, fn) {
    //如果是直接通过require('./layer')引用时，这时候的this对象不是Layer对象的实例
    //会直接返回一个新的Layer实例
    if (!(this instanceof Layer)) {
        return new Layer(path, options, fn);
    }

    this.path = path;   //把每个路由对象中路径保存下来
    this.handle = fn;
}

/**
 * Handle the request for the Layer
 * @param req
 * @param res
 * @param next
 */
Layer.prototype.handle_request = function handle_request(req, res, next) {
    var fn = this.handle;
    try {
        res.send = response.send;
        fn(req, res, next);
    } catch (err) {
        next(err);
    }
}

Layer.prototype.handle_error_route = function (req, res, next) {
    res.send = response.send;
    res.send("route error");
}


/**
 * check if this route match `path`, if so
 * populate `.params`
 */
Layer.prototype.match = function match(path) {
    //判断每个Layer中的path和真实请求路径是否相等
    if (this.path === path) {
        return true;
    } else {
        return false
    }
}