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
