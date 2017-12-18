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

proto.route = function route(path) {
    var route = new Route();

    var layer = new Layer(path, {}, route.dispatch.bind(route));

    layer.route = route;
    this.stack.push(layer);
    return route;
}


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
    var path = '/';

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