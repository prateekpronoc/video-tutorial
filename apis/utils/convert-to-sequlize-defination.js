'use strict'

var restify = require('restify');
var Promise = require('bluebird');

module.exports = function(structure, _) {

    var Sequelize = require('sequelize'),
        typeMappings = {
            string: Sequelize.STRING,
            integer: Sequelize.INTEGER,
            boolean: Sequelize.BOOLEAN,
            datetime: Sequelize.DATE,
            double: Sequelize.DOUBLE,
            text: Sequelize.TEXT,
            float: Sequelize.FLOAT,
            unsignedint: Sequelize.INTEGER.UNSIGNED,
            longtext: Sequelize.TEXT,
            blob: Sequelize.BLOB,
            longblob: Sequelize.BLOB,
            mediumblob: Sequelize.BLOB,
            'decimal(10,2)': Sequelize.DECIMAL(10, 2),
            'decimal(19,5)': Sequelize.DECIMAL(19, 5),
            'decimal(18,2)': Sequelize.DECIMAL(18, 2),
            'decimal(10,0)': Sequelize.DECIMAL,
            decimal: Sequelize.DECIMAL,
            timestamp: Sequelize.DATE,
            'bigint(20)': Sequelize.BIGINT,
            mediumtext: Sequelize.TEXT
        };


    return _.transform(structure, function(result, type, field) {
        var value = {
            field: field,
            type: typeMappings[type]
        };
        if (field === 'id') {
            value.primaryKey = true;
            value.autoIncrement = true;
        }
        result[_.camelCase(field)] = value;
//        console.log('result' + result);
    });
    //return structure;

};