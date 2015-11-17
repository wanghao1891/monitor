function site_error(req, res) {
    return res.send('Error');
};

function site_not_found(req, res) {
    return res.send('Not found!');
};

module.exports = {
    site_error: site_error,
    site_not_found: site_not_found,
    home: require('./home')
};
