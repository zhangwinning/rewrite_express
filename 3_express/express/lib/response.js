var res = exports = module.exports = {}
res.send = function send(body) {
    this.end(body);
}
