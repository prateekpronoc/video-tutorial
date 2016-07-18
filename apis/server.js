var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var config = require('./config.js');
var rest = require("./REST.js");
var app = express();
var multiparty = require('connect-multiparty'),
    imgUpload = multiparty({ uploadDir: './public/imagesPath' }),
    fileUpload = multiparty({ uploadDir: './public/filesPath' });

function Apis() {
    var self = this;
    self.connectMysql();
};

Apis.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool(config.database);
    self.configureExpress(pool);
    // pool.getConnection(function(err, connection) {
    //     if (err) {
    //         self.stop(err);
    //     } else {
    //         self.configureExpress(connection);
    //     }
    // });
}

// Apis.prototype.configureExpress = function(connection) {
Apis.prototype.configureExpress = function(pool) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.static('public'));
    var router = express.Router();
    app.use('/api', router);
    // var rest_router = new rest(router, connection, md5, jwt, imgUpload, fileUpload);
    var rest_router = new rest(router, pool, md5, jwt, imgUpload, fileUpload);
    self.startServer();
}

Apis.prototype.startServer = function() {
    app.listen(3000);
}

Apis.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new Apis();
