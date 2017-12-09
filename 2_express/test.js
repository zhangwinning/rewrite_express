let express = require('./express');
let app = express();

app.get('/test', (req, res) => res.send('Hello World!'));
app.get('/get_test', (req, res) => res.send('get_test Hello World!'));
app.listen(3001, function () {
    console.log('the server is listening:', 3001);
});