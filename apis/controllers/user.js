'use strict'
module.exports = function(svr, database, _) {
    console.log('route');
    svr.route('/user')
        .get(function(req, res, next) {
            res.send('hi am using user.js file to fetch Route');
        })
        .post((req, res, next) => {
            console.log(req);
            res.send('Post request !!!', req.body);
        })
}
