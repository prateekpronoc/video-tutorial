var mysql = require("mysql");

var self={
    getByField: function(request, connection){
//        var selectedFields = request.selectFields || "*";
        var query = "SELECT * FROM ?? where ??=?";
        var queryValues = [request.table, request.column, request.id];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err,rows){
            if(err) {
                return false;
            } else {
                return rows;
            }
        });
    },
    signup : function(request, connection, md5, callback){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var queryValues = ["user_login","email","password",request.email,md5(request.password)];
        query = mysql.format(query,queryValues);
        connection.query(query, function(err,rows){
            if(err) {
                callback({"Error" : true, "Message" : err});
            } else {
                callback({"Error" : false, "Message" : "User Added"});
            }
        });
    },
    login : function(request, connection, jwt, md5, callback){
        var query = "SELECT * FROM ?? WHERE ??=? && ??=?";
        var queryValues = ["user_login","email",request.email,"password",md5(request.password)];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err,rows){
            if(err) {
                callback({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                var token = jwt.sign(rows[0], request.secretString, {
                    expiresIn: "1d" // expires in 24 hours
                });
                callback({"Error" : false, "Message" : "Success", "token" : token});
            }
        });
    },
    getProfile : function(request, connection, callback){
        var query = "SELECT * FROM ?? where id=?";
        var queryValues = ["user_login", request.userId];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err,rows){
            if(err) {
                callback({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                callback({"Error" : false, "Message" : "Success", "Profile" : rows});
            }
        });
    },
    addCourseWithUsers: function(query, request, connection, callback){
        var query = query, queryValues;
        connection.beginTransaction(function(err) {
            if (err) {
                callback(err);
            }
            connection.query(query, function(err, rows) {
                if (err) {
                    return connection.rollback(function() {
                        callback(err);
                    });
                }
                var courseId = rows.insertId || request.id;
                query = "DELETE FROM ?? where ?? = ?";
                queryValues = ["courses_instructor", "course_id", courseId];
                query = mysql.format(query, queryValues);
                connection.query(query, function(err, rows) {
                    if (err) {
                        return connection.rollback(function() {
                            callback(err);
                        });
                    }
                    query = "INSERT INTO ??(??, ??) values ?";
                    queryValues = ["courses_instructor", "course_id", "user_id"];
                    var values = [];
                    for(var i = 0; i < request.usersList.length; i++){
                        values.push([courseId, request.usersList[i]]);
                    }
                    queryValues.push(values);
                    query = mysql.format(query, queryValues);
                    connection.query(query, function(err, rows) {
                        if (err) {
                            return connection.rollback(function() {
                                callback(err);
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    callback(err);
                                });
                            }
                            callback(err, rows);
                        });
                    });
                });
            });
        });
    },
    addUpdateCourse: function(request, connection, callback){
        var query, queryValues;
        if(request.id){
            query = "UPDATE ?? SET ? where ?? = ?";
            queryValues = ["courses", {"name": request.name, "description": request.description, "demo": request.demo, "validFrom": request.validFrom, "validTo": request.validTo}, "id", request.id];
        } else {
            query = "INSERT INTO ??(??, ??, ??, ??, ??) values (?, ?, ?, ?, ?)";
            queryValues = ["courses", "name", "description", "demo", "validFrom", "validTo", request.name, request.description, request.demo, request.validFrom, request.validTo];
        }
        query = mysql.format(query, queryValues);
        if(request.usersList && request.usersList.length > 0){
            self.addCourseWithUsers(query, request, connection, function(err, rows){
                if(err){
                    callback({"Error": true, "Message": err});
                } else {
                    callback({"Error": false, "Message": "Course Added"});
                }
            });
        } else {
            connection.query(query, function(err, rows){
                if(err){
                    callback({"Error": true, "Message": err});
                } else {
                    callback({"Error": false, "Message": "Course Added"});
                }
            });
        }
    },
    addUpdateUnitToCourse: function(request, connection, callback){
        if(request.courseId){
            var query = query, queryValues;
            connection.beginTransaction(function(err) {
                if (err) {
                    callback(err);
                }
                connection.query(query, function(err, rows) {
                    if (err) {
                        return connection.rollback(function() {
                            callback(err);
                        });
                    }
                    query = "INSERT INTO ??(??, ??) values ?";
                    queryValues = ["courses_instructor", "course_id", "user_id"];
                    var values = [];
                    for(var i = 0; i < request.usersList.length; i++){
                        values.push([courseId, request.usersList[i]]);
                    }
                    queryValues.push(values);
                    query = mysql.format(query, queryValues);
                    connection.query(query, function(err, rows) {
                        if (err) {
                            return connection.rollback(function() {
                                callback(err);
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    callback(err);
                                });
                            }
                            callback(err, rows);
                        });
                    });
                });
            });
        }
    }
//    addInstructorToCourse: function(request, connection, callback){
//        if(request.courseId && request.usersList && request.usersList.length > 0){
//            var course = self.getById({"table": "courses", "id": request.courseId}, connection);
//            if(course){
//                var query = "INSERT INTO ??(??, ??) values ?";
//                var queryValues = ["courses_instructor", "course_id", "user_id"];
//                var values = [];
//                for(var i = 0; i < request.usersList.length; i++){
//                    values.push([request.courseId, request.usersList[i]]);
//                }
//                queryValues.push(values);
//                query = mysql.format(query, queryValues);
//                connection.query(query, function(err, rows){
//                    if(err){
//                        callback({"Error": true, "Message": err});
//                    } else {
//                        callback({"Error": false, "Message": "User Added"});
//                    }
//                });
//            } else {
//                callback({"Error": true, "Message": "Course not present"});
//            }
//        } else {
//            callback({"Error": true, "Message": "Course not present"});
//        }
//    }
};

module.exports = self;