function index(req, res, next) {
    res.send('Welcome!');
}

module.exports = {
    index: index
};
