var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('./config.js');
var rest = require("./REST.js");
var app = express();
// var sequelize = new Sequelize('tutorialsdb', 'root', 'data', {
//     host: 'localhost',
//     dialect: 'mysql',

//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//     },

//     // SQLite only
//     storage: 'path/to/database.sqlite'
// });

function Apis() {
    var self = this;
    self.connectMysql();
};

Apis.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool(config.database);
    pool.getConnection(function(err, connection) {
        if (err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
}

Apis.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);
    var rest_router = new rest(router, connection, md5, jwt);
    self.startServer();
}

Apis.prototype.startServer = function() {
    app.listen(3000, function() {
        console.log("All right ! I am alive at Port 3000.");
    });
}

Apis.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new Apis();
