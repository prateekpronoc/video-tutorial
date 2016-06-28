var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var Sequelize = require("sequelize");
var config = require('./config.js');
var rest = require("./REST.js");
var app = express();

function Apis() {
    var self = this;
    self.connectMysql();
};

Apis.prototype.connectMysql = function() {
    var sequelize = new Sequelize('onlineCoursesdb', 'root', 'data', {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });
    var self = this;
    self.configureExpress(sequelize);
}

Apis.prototype.configureExpress = function(sequelize) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);
    var rest_router = new rest(router, sequelize, md5, jwt);
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
