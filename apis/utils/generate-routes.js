'use strict'
var userapis = require('../controllers/user.js');
//var fs = require('fs');
module.exports = (config, _) => {
    var fs = config.Promise.promisifyAll(require("fs"));
    return (database, svr) => {
        fs.lstatAsync('routes')
            .then((isDirectoryExits) => {
                return fetchsvcAndGenerate();
            })
            .then((isDirectoryExits) => {
                console.log('directory found, vola !!!', isDirectoryExits);
            }).catch((error) => {
                //do something...
                console.log('director not found!!!!');
                config.Promise.reject({ error: 'director not found' });
            });


        // console.log('test test test !!!!');
        // console.log(config);
        // console.log('started generating routes!!!!!');
        // console.log('models', database.models);
        // var entity = 'user'
        // fileExists('../routes/' + test + '.js');
        //var fun = require('../routes/' + entity)()(config, database);

        // _.forEach(config.entities, (entity) => {
        //     var fun = require('../routes/' + entity)(config, database);

        // });
        // svr.get('/api/test', (req, res) => {
        //     database.user.findAll().then((usr) => {
        //         res.send(usr);
        //     });
        // })
        // console.log('entitys');
        // userapis(svr, database, _);
        return config.Promise.resolve({});
    }

    function fetchsvcAndGenerate() {
        return config.Promise.resolve(true);
    }

    function fileExists(path) {



        fs.lstatAsync('routes').then((resp) => {
            fs.existsAsync(path).then((success) => {
                console.log(path);
            }).catch((error) => {
                console.log(error);
            });
            // if (fs.existsASync('/etc/file')) {
            //     console.log('Found file');
            // }
            // fs.statsSync(path).isFile().then((error, success) => {
            //     if (success) {
            //         console.log(success);
            //     }
            // })
        });
        // fs.statsAsync(path).isFile().then((resp) => {
        //     console.log(resp);
        // });

        // try {
        //     return fs.statSync(path).isFile();
        // } catch (e) {

        //     if (e.code == 'ENOENT') { // no such file or directory. File really does not exist
        //         console.log("File does not exist.");
        //         return false;
        //     }

        //     console.log("Exception fs.statSync (" + path + "): " + e);
        //     throw e; // something else went wrong, we don't have rights, ...
        // }
    }

    function generateAPIs(entity, svr) {
        //var api = getAPIURL(entity);
        // console.log('api' + entity);
        //svr.get(getAPIURL,)
        // svr.get('/api/test', function(req, res) {
        //         res.send('test');
        //     })
        //     // svr.get(getAPIURL(entity), function(req, res) {
        //     //     res.send('test apis');
        //     // });
    }

    // user: function(svr, database) {
    //     console.log('user');
    // }

    // function user(svr, database) {
    //     console.log('user');
    // }

    // function handler(req, res) {
    //     res.send('test apis');
    // }

    // function getAPIURL(entity) {
    //     return '/api/' + entity;
    // }
}
