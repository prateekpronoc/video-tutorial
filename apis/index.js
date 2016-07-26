'use strict'
var promise = require('bluebird'),
    server = require('./utils/create-server.js'),
    config = require('./config/my-config.json'),
    svr = server(config)();
console.log(config.port);
var config, server;

process.on('SIGINT', function() {
    // shuttingDown = true;
    server.close(function() {
        process.exit();
    });
});

svr.then((svr) => {
    server = svr;
    console.log('server started !!!');
});
