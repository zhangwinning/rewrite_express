exports = module.exports = createApplication;

let application = require('./application');


//这里比1_express多一个路由
function createApplication(argument) {
    let app = function (req, res, next) {
        app.handle(req, res, next);
    }
    Object.assign(app, application);
    return app;
}