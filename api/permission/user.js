function check_auth(req, res, next) {
    next();
}

module.exports = {
    check_auth: check_auth
};
