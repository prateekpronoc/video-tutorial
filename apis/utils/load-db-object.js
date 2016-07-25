'use strict'
var Promise = require('bluebird');
var dbStructure = require('.././dbstructure.json');
var convertToSequelizeType = require('./convert-to-sequlize-defination.js');
var Sequelize = require('sequelize');
var _ = require('lodash');
module.exports = function() {
    //console.log(dbStructure.entities);
    var sequelize = new Sequelize('tutorialsdb', 'root', 'data', { define: { timestamps: false }, host: 'localhost', port: '3306', dialect: 'mysql', omitNull: true });
    _.forOwn(dbStructure.tables, (structure, name) => {

        var def = convertToSequelizeType(structure, _);
        //console.log('def', def);
        //console.info('Written all fields to a file~!', dbStructure.entities[name]);
        sequelize[dbStructure.entities[name]] = sequelize.define(dbStructure.entities[name], def, {
            talbeName: name,
            underscored: true,
            freezeTableName: true
        });

        //console.info('Written all fields to a file~!', sequelize[dbStructure.entities[name]]);
    });

    return Promise.resolve({ db: sequelize, entities: dbStructure.entities }); //sequelize;
    // return function() {
    // 	//return Promise.resolve({value:1});
    // }
}
