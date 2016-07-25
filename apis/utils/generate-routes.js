'use strict'
module.exports = (config, _) => {
    return (database, svr) => {
        // console.log('test test test !!!!');
        // console.log(config);
        // console.log('started generating routes!!!!!');
        // console.log('models', database.models);
        _.forEach(config.entities, (entity) => {
            console.log('entitys', getAPIURL(entity));

            generateAPIs(entity, svr);
        });
        // svr.get('/api/test', (req, res) => {
        //     database.user.findAll().then((usr) => {
        //         res.send(usr);
        //     });
        // })
        return config.Promise.resolve({});
    }

    function generateAPIs(entity, svr) {
        //var api = getAPIURL(entity);
        console.log('api' + entity);
        // svr.get('/api/test', function(req, res) {
        //         res.send('test');
        //     })
        //     // svr.get(getAPIURL(entity), function(req, res) {
        //     //     res.send('test apis');
        //     // });
    }

    function handler(req, res) {
        res.send('test apis');
    }

    function getAPIURL(entity) {
        return '/api/' + entity;
    }
}
