let express = require('./express');
let app = express();


var myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
}
app.use(myLogger);
app.get('/test', (req, res) => res.send('Hello World!'));
app.listen(3002, function () {
    console.log('the server is listening:', 3002);
});