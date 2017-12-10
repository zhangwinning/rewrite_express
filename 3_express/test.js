let express = require('./express');
let app = express();

app.get('/test', (req, res) => res.send('Hello World!'));
app.listen(3002, function () {
    console.log('the server is listening:', 3002);
});