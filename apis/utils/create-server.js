'use strict'
var Promise = require('bluebird');
var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');
var loadDbObject = require('./load-db-object.js');
var allRoutes = require('./generate-routes.js');
var _ = require('lodash');
module.exports = function(config) {
    console.log(config);
    var server,
        database, sequelize;
    config.Promise = Promise;
    let env = process.env;
    let port = config.port || process.env.PORT || 8080;
    let ip = env.OPENSHIFT_NODE4_IP || '127.0.0.1';
    return function() {
        return new Promise.try(function() {
            server = express();
            server.set('port', config.port || process.env.app_port || 8080);
            server.listen(port, ip, function() {
                console.log('listing the server at port ', port);
            });
            return server;
        }).then(function(svr) {
            return configureServer(svr);
            //return new Promise.resolve(server);
        }).then((svr) => {
            return loadDbStructure(svr);
        }).then(function(svr) {
            return createRoutes(svr);
        }).then(function(svr) {
            return config.Promise.resolve(svr);
        });
    };

    function syncSequelizeDbStructure(svr) {
        return svr;
    }

    function loadDbStructure(svr) {
        database = loadDbObject();
        database.then((dataBase) => {
            // console.log(dataBase.db)
            sequelize = dataBase.db;
            config.entities = dataBase.entities;
        });
        return svr;
    }

    function createAndLoadServer() {

    }

    function createRoutes(svr) {
        // console.log('generating routes');
        allRoutes(config, _)(sequelize, svr).then(() => {
            //console.log('routes generated');
        });
        return svr;
    }

    function configureServer(svr) {
        svr.use(bodyParser.urlencoded({ extended: true }));
        svr.use(bodyParser.json());
        svr.use(cors());
        svr.use(express.static('public'));
        //console.log('options set');
        return svr
    }
};

// var createAndConfig = require('./create-and-config.js');
// var _ = require('lodash');
// module.exports = function() {
//     var config = {};
//     //config.api = express();
//     config.Promise = Promise;
//     process.on('SIGINT', () => {
//         // Do any clean up required
//         console.error('SIGINT Received: ' + process.pid);
//         console.log('SIGINT Received: ' + process.pid);
//         // if (config && config.logger) {
//         //     config.logger.info('SIGINT Received:' + process.pid);
//         // }
//         //api.close();
//     });

//     createAndConfig(config, _);



//     function shutdown() {
//         if (config.queue) {
//             console.log('Closing the queue');
//             config.queue.shutdown(5000, function(err) {
//                 config.logger.info('Kue shutdown: ', err || '');
//                 process.exit(0);
//             });
//         }
//         if (server) {
//             console.log('Closing the server...');
//             server.close();
//             server = undefined;
//         }
//         setTimeout(function() {
//             console.log('Exiting the process');
//             // 300ms later the process kill it self to allow a restart
//             process.exit(0);
//         }, 300);
//     }
// };

// // var Promise = require('bluebird'),
// //     express = require('express'),
// //     api = express(),
// //     fetchDbObject = require('./load-db-object.js'),
// //     // routes = require('./generate-routes'),
// //     _ = require('lodash'),
// //     createAndConfig = require('./create-and-config.js');

// // module.exports = () => {
// //     var config = {};
// //     config.Promise = Promise;
// //     config.api = express();
// //     //console.log(config);
// //     var myApp = createAndConfig()(config, api);
// //     console.log(myApp);
// //     // return Promise.try(() => {
// //     //     api.listen(8080, () => {
// //     //         console.log('server is listing on port 8080');
// //     //     });
// //     //     return api
// //     // }).then((svr) => {
// //     //     var dbObj = fetchDbObject();
// //     //     console.log(dbObj.db);
// //     //     return dbObj.db;
// //     //     // Promise.resolve(svr);
// //     // }).then((database) => {
// //     //     // if (database) {
// //     //     //     return route = reoutes()(database);
// //     //     // }
// //     //     Promise.resolve(api);
// //     // });
// //     // .then((svrRoute) => {
// //     //     console.log('routes : ', svrRoute);
// //     //     Promise.resolve(api);
// //     // });
// //     // return new Promise((resolve) => {
// //     //     api.listen(8080, () => {
// //     //         console.log('server is listing to port 3000');
// //     //     });
// //     //     //return resolve(api);
// //     //     return api;
// //     // }).then((api) => {
// //     // 	console.log('server is listing to port 3000');
// //     //     return resolve(api);
// //     // });
// // };
