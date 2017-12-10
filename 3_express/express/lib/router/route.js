exports = module.exports = Route;
let slice = Array.prototype.slice;

let Layer = require('./layer');

let methods = ['get'];

function Route(path) {
    this.path = path;
    this.stack = [];
    this.methods = {};
}

/**
 * dispatch req, res into this route
 * @param req
 * @param res
 * @param done
 */
Route.prototype.dispatch = function dispatch(req, res, done) {
    var idx = 0;
    var stack = this.stack;
    if (stack.length === 0) {
        return done();
    }

    var method = req.method.toLowerCase();

    req.route = this;

    next();

    function next(err) {
        var layer = stack[idx++];
        layer.handle_request(req, res, next);
    }
}

//为route对象添加方法，并且在创建的route对象的stack中添加layer
methods.forEach(function (method) {
    Route.prototype[method] = function () {
        let handlers = slice.call(arguments);
        let handler = handlers[0];
        let layer = Layer('/', {}, handler);

        layer.method = method;

        this.methods[method] = true;

        this.stack.push(layer);
    }
    return this;
});