var app = exports = module.exports = {};
var http = require('http');

app.listen = function listen() {
	var server = http.createServer(this);
	return server.listen.apply(server, arguments);
}