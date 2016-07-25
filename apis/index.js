'use strict'
var promise = require('bluebird'),
    server = require('./utils/create-server.js'),
    svr = server()();

var config, server;

process.on('SIGINT', () => {
    // Do any clean up required
    console.error('SIGINT Received: ' + process.pid);
    console.log('SIGINT Received: ' + process.pid);
    console.log(server);
    // if (config && config.logger) {
    //     config.logger.info('SIGINT Received:' + process.pid);
    // }
    // shutdown();

});

svr.then((svr) => {
    server = svr;
    console.log('server started !!!');
});
