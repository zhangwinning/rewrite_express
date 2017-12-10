exports = module.exports = proto;
let Route = require('./route');
let Layer = require('./layer');

function proto() {
    function router(req, res, next) {
        router.handle(req, res, next);
    }

    router.stack = [];	//这里是router.stack, 而不是this.stack
    router['route'] = proto['route'];
    router['handle'] = proto['handle'];
    router['use'] = proto['use'];
    return router;
}

/**
 * Create a new Route for the given path
 * Each route contains a separate middleware stack and verb handles
 * @param path
 * @returns {Route}
 */
proto.route = function route(path) {
    var route = new Route();

    var layer = new Layer(path, {}, route.dispatch.bind(route));

    layer.route = route;
    this.stack.push(layer);
    return route;
}

//这里为什么会写的怎么乱，肯定是有原因的
//这里的调用流程是:
// createApplication-->application.handle-->router.handle
// 这里调用这个函数时，proto是上下文
proto.handle = function handle(req, res, out) {
    var self = this;
    var stack = self.stack;
    var path = getPathname(req);    //获取请求路径
    var idx = 0;
    next();

    function next(err) {
        var layer;
        var match;
        var route;

        if (idx >= stack.length) {
            return;
        }

        while (match !== true && idx < stack.length) {
            layer = stack[idx++];
            match = matchLayer(layer, path);
            route = layer.route;
        }
        if (match) {
            layer.handle_request(req, res, next);
        } else {
            layer.handle_error_route(req, res, next);
        }
    }
}

proto.use = function use(callback) {
    // var offset = 0;
    var path = '/';

    // default path to '/'
    // disambiguate router.use([fn])
    // if (typeof fn !== 'function') {
    //     var arg = fn;
    //
    //     while (Array.isArray(arg) && arg.length !== 0) {
    //         arg = arg[0];
    //     }
    //
    //     // first arg is the path
    //     if (typeof arg !== 'function') {
    //         offset = 1;
    //         path = fn;
    //     }
    // }
    // let callback = Array.prototype.slice(arguments, offset);

    var layer = new Layer(path, {}, callback);

    layer.route = undefined;

    this.stack.push(layer);
    return this;
}

var parseUrl = require('parseurl');

function getPathname(req) {
    return parseUrl(req).pathname;
}

function matchLayer(layer, path) {
    try {
        return layer.match(path);
    } catch (err) {
        return err;
    }
}