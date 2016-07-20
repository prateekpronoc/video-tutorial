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
    fileUpload = multiparty({ uploadDir: './public/filesPath' }),
    port = 8080;
var _ = require('lodash');
var dbStructure = require('./dbstructure.json');
var convertToSequelizeType = require('./utils/convert-to-sequlize-defination.js')
    //loading the database structure
var Sequelize = require('sequelize');
var sequelize = new Sequelize('tutorialsdb', 'root', 'data', { define: { timestamps: false }, host: 'localhost', port: '3306', dialect: 'mysql', omitNull: true });
_.forOwn(dbStructure.tables, (structure, name) => {
    var def = convertToSequelizeType(structure, _);
    sequelize[dbStructure.entities[name]] = sequelize.define(dbStructure.entities[name], def, {
        talbeName: name,
        underscored: true,
        freezeTableName: true
    })
});

//Load the db relationship
_.forEach(dbStructure.relations, function(rel) {
    sequelize[rel.src][rel.rel](sequelize[rel.trgl, rel.relation]);
})

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
    var rest_router = new rest(router, pool, md5, jwt, imgUpload, fileUpload, sequelize);
    self.startServer();
}

Apis.prototype.startServer = function() {
    app.listen(config.port, function() {
        console.log('%s listening at %s at port:' + config.port);
    });
}

Apis.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new Apis();
