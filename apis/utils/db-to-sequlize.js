'use strict';

(function() {
    var mysql = require('mysql');
    var Promise = require('bluebird');
    var logger = require('bunyan').createLogger({
        name: 'dbconfigurer',
        level: 'info'
    });
    var fs = require('fs');
    var _ = require('lodash');
    //var config = require('./config');
    var dbName = 'tutorialsdb';
    var connection = mysql.createConnection({
        database: 'tutorialsdb', //config.database.database,
        user: 'root', //config.database.user,
        password: 'data', //config.database.password,
        host: 'localhost'
    });
    var obj = {},
        fields = [];

    connection.connect(function() {
        logger.info('Connected to database localhost');
    });
    var pendingCount = 0,
        mapped = {},
        tableMapped = {};

    function getMappedField(value) {
        var count = 0;
        if (value.indexOf('int') === 0) {
            if (value.indexOf('unsigned') > 0) {
                return 'unsignedint';
            } else {
                return 'integer';
            }
        } else if (value.indexOf('tinyint') === 0) {
            count = parseInt(value.substr(value.indexOf('(') + 1, value.indexOf(')')));
            if (count === 1) {
                return 'boolean';
            } else {
                return 'integer';
            }
        } else if (value.indexOf('bit') === 0) {
            return 'boolean';
        } else if (value.indexOf('varchar') === 0 || value.indexOf('char') === 0) {
            count = parseInt(value.substr(value.indexOf('(') + 1, value.indexOf(')')));
            if (count <= 255) {
                return 'string';
            }
            return 'text';
        } else if (value.indexOf('float') === 0) {
            return 'float';
        } else if (value.indexOf('text') === 0) {
            return 'text';
        } else if (value.indexOf('double') === 0 || value.indexOf('numeric') === 0) {
            return 'double';
        } else if (value.indexOf('blob') > -1) {
            return 'blob';
        } else {
            return value;
        }
    }

    connection.query('show tables', function(err, rows) {
        var schemaDef = {};
        var all = [];
        logger.info('Tables: ', rows);
        _.forEach(_.map(rows, 'Tables_in_' + dbName), function(tableName) {
            pendingCount += 1;
            all.push(new Promise(function(resolve, reject) {
                connection.query('desc ' + tableName, function(err, data) {
                    if (err) {
                        reject();
                        return;
                    }
                    schemaDef[tableName] = data;
                    pendingCount -= 1;
                    obj[tableName] = _.zipObject(_.map(data, 'Field'), _.map(data, 'Type'));
                    tableMapped[tableName] = _.camelCase(tableName);
                    fields = fields.concat(_.map(data, 'Type'));
                    resolve();
                });
            }).reflect());
        });
        Promise.all(all).then(function() {
            var all = [];
            all.push(new Promise(function(resolve) {
                fs.writeFile('output/' + dbName + '-scheme.json', JSON.stringify(schemaDef), function(err) {
                    if (err) {
                        return logger.info(err);
                    }
                    logger.info('Database schema definitions have been written to the external file!');
                    resolve();
                });
            }));
            all.push(new Promise(function(resolve) {
                fs.writeFile('output/' + dbName + '-structure_draft.json', JSON.stringify(obj), function(err) {
                    if (err) {
                        return logger.info(err);
                    }
                    logger.info('Database structures have been written to the external file!');
                    resolve();
                });
            }));
            all.push(new Promise(function(resolve) {
                fs.writeFile('output/' + dbName + '-tables.json', JSON.stringify(tableMapped), function(err) {
                    if (err) {
                        return logger.info(err);
                    }
                    logger.info('Database Tables have been written to the external file!');
                    resolve();
                });
            }));
            var res = {};
            res.entities = tableMapped;
            res.tables = {};
            _.forOwn(obj, function(tableData, tableName) {
                res.tables[tableName] = _.transform(tableData, function(result, value, key) {
                    result[key] = getMappedField(value);
                });
            });

            _.forEach(_.uniq(fields), function(value) {
                mapped[value] = getMappedField(value);
            });
            all.push(new Promise(function(resolve) {
                fs.writeFile('output/' + dbName + '-allfields.json', JSON.stringify(mapped), function(err) {
                    if (err) {
                        return logger.error(err);
                    }
                    logger.info('Written all fields to a file~!');
                    resolve();
                });
            }));
            all.push(new Promise(function(resolve) {
                fs.writeFile('output/' + dbName + '-structure_final.json', JSON.stringify(res), function(err) {
                    if (err) {
                        return logger.info(err);
                    }
                    logger.info('Database structures have been written to the external file!');
                    resolve();
                });
            }).reflect());
            Promise.all(all).then(function() {
                logger.info('All structuring work is done: Exiting ...');
                process.exit(0);
            });
        });
    });
})();
