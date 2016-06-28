var mysql = require("mysql");

var self = {
    getByField: function(request, connection) {
        //        var selectedFields = request.selectFields || "*";
        var query = "SELECT * FROM ?? where ??=?";
        var queryValues = [request.table, request.column, request.id];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                return false;
            } else {
                return rows;
            }
        });
    },
    signup: function(request, connection, md5, callback) {
        var query = "INSERT INTO ??(??,??, ??) VALUES (?,?, ?)";
        var queryValues = ["user_login", "email", "phone", "password", request.email, request.phone, md5(request.password)];
        query = mysql.format(query, queryValues);
        connection.beginTransaction(function(err) {
            if (err) {
                callback(err);
            }
            connection.query(query, function(err, rows) {
                if (err) {
                    return connection.rollback(function() {
                        callback({ "Error": true, "Message": err });
                    });
                }
                var userId = rows.insertId
                query = "INSERT INTO ??(??, ??, ??) values (?, ?, ?)";
                queryValues = ["user_info", "userId", "firstName", "lastName", userId, request.firstName, request.lastName];
                query = mysql.format(query, queryValues);
                connection.query(query, function(err, rows) {
                    if (err) {
                        return connection.rollback(function() {
                            callback({ "Error": true, "Message": err });
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback({ "Error": true, "Message": err });
                            });
                        }
                        callback({ "Error": false, "Message": "User Added" });
                    });
                });
            });
        });
    },
    login: function(request, connection, jwt, md5, callback) {
        var loginIdField = /^\d{10}$/.test(request.email) ? 'phone' : 'email';
        var query = "SELECT * FROM ?? WHERE ??=? && ??=?";
        var queryValues = ["user_login", loginIdField, request.email, "password", md5(request.password)];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                var token = jwt.sign(rows[0], request.secretString, {
                    expiresIn: "1d" // expires in 24 hours
                });
                callback({ "Error": false, "Message": "Success", "token": token, "user": rows[0].id, 'profileType': rows[0].profileType });
            }
        });
    },
    getProfile: function(request, connection, callback) {
        var query = "SELECT * FROM user_info join user_login where userId=? and user_login.id = user_info.userId";
        var queryValues = [request.userId];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                callback({ "Error": false, "Message": "Success", "Profile": rows[0] });
            }
        });
    },
    getAllUsers: function(type, value, connection, callback) {
        var query, queryValues;
        if (type == "byType") {
            query = "SELECT * from ?? ul JOIN ?? ui ON ul.id = ui.userId and ul.profileType = ?";
            queryValues = ["user_login", "user_info", value];
        }
        query = mysql.format(query, queryValues);
        console.log(query);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                callback({ "Error": false, "Message": "Success", "users": rows });
            }
        });
    },
    updateUser: function(request, connection, callback) {
        var query = "UPDATE ?? SET ? where ?? = ?";
        var queryValues = ["user_login", { "email": request.email, "phone": request.phone }, "id", request.userId];
        query = mysql.format(query, queryValues);
        connection.beginTransaction(function(err) {
            if (err) {
                callback(err);
            }
            connection.query(query, function(err, rows) {
                if (err) {
                    return connection.rollback(function() {
                        callback({ "Error": true, "Message": err });
                    });
                }
                var userId = request.userId
                query = "UPDATE ?? SET ? where ?? = ?";
                queryValues = ["user_info", { "firstName": request.firstName, "lastName": request.lastName, "about": request.about, "billingAddress": request.billingAddress, "profilePhoto": request.profilePhoto }, "userId", userId];
                query = mysql.format(query, queryValues);
                connection.query(query, function(err, rows) {
                    if (err) {
                        return connection.rollback(function() {
                            callback({ "Error": true, "Message": err });
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback({ "Error": true, "Message": err });
                            });
                        }
                        callback({ "Error": false, "Message": "User Added" });
                    });
                });
            });
        });
    },
    addCourseWithUsers: function(query, request, connection, callback) {
        var query = query,
            queryValues;
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
                    for (var i = 0; i < request.usersList.length; i++) {
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
    addUpdateCourse: function(request, connection, callback) {
        var query, queryValues;
        if (request.id) {
            query = "UPDATE ?? SET ? where ?? = ?";
            queryValues = ["courses", { "name": request.name, "description": request.description, "demo": request.demo, "validFrom": request.validFrom, "validTo": request.validTo }, "id", request.id];
        } else {
            query = "INSERT INTO ??(??, ??, ??, ??, ??) values (?, ?, ?, ?, ?)";
            queryValues = ["courses", "name", "description", "demo", "validFrom", "validTo", request.name, request.description, request.demo, request.validFrom, request.validTo];
        }
        query = mysql.format(query, queryValues);
        if (request.usersList && request.usersList.length > 0) {
            self.addCourseWithUsers(query, request, connection, function(err, rows) {
                if (err) {
                    callback({ "Error": true, "Message": err });
                } else {
                    callback({ "Error": false, "Message": "Course Added" });
                }
            });
        } else {
            connection.query(query, function(err, rows) {
                if (err) {
                    callback({ "Error": true, "Message": err });
                } else {
                    callback({ "Error": false, "Message": "Course Added" });
                }
            });
        }
    },
    getAllCourses: function(type, id, connection, callback) {
        var query, queryValues;
        if (type == "all") {
            query = "SELECT c.*, GROUP_CONCAT(CONCAT(Ui.firstName, ' ', ui.lastName)) as instructors from ?? c LEFT JOIN (courses_instructor ci, user_info ui) ON c.id = ci.course_id and ci.user_id = ui.userId group by c.id";
            queryValues = ["courses"];
        } else if (type == "allRunning") {
            query = "SELECT * from ?? where validFrom IS NULL and validTo IS NULL";
            queryValues = ["courses"];
        } else if (type == 'allSeasional') {
            query = "SELECT * from ?? where validFrom IS NOT NULL and validTo IS NOT NULL";
            queryValues = ["courses"];
        } else if (type == "subscribed") {
            query = "select * from ?? where ?? IN (select ?? from course_subscription where ?? = ?)";
            queryValues = ["courses", "id", "course_id", "user_id", id];
        } else if (type == "unsubscribed") {
            query = "select * from ?? where ?? NOT IN (select ?? from course_subscription where ?? = ?)";
            queryValues = ["courses", "id", "course_id", "user_id", id];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                callback({ "Error": false, "Message": "Success", "courses": rows });
            }
        });
    },
    addUpdateUnitToCourse: function(request, connection, callback) {
        if (request.courseId) {

        }
    },
    getAllUnits: function(type, id, connection, callback) {
        var query, queryValues;
        if (type == 'all') {
            query = "SELECT * from ?? LEFT JOIN";
            queryValues = ["units"];
        } else if (type == 'byCourseId') {
            query = "SELECT u.*, GROUP_CONCAT(l.name) as lessons from ?? u JOIN (course_unit_lesson_r cul, lessons l) ON cul.course_id = ? and u.id = cul.unit_id and l.id = cul.lesson_id GROUP BY u.id";
            queryValues = ["units", id];
        }
        query = mysql.format(query, queryValues);
        console.log(query);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                callback({ "Error": false, "Message": "Success", "units": rows });
            }
        });
    },
    addUpdateLesson: function(request, connection, callback) {
        var query, queryValues;
        if (request.id) {
            query = "UPDATE ?? SET ? where ?? = ?";
            queryValues = ["lessons", { "name": request.name, "description": request.description, "video": request.video, "air_date": request.airDate }, "id", request.id];
        } else {
            query = "INSERT INTO ??(??, ??, ??, ??) values (?, ?, ?, ?)";
            queryValues = ["lessons", "name", "description", "video", "air_date", request.name, request.description, request.video, request.airDate];
        }
        query = mysql.format(query, queryValues);
        //        connection.query(query, function(err, rows){
        //            if(err){
        //                callback({"Error": true, "Message": err});
        //            } else {
        //                callback({"Error": false, "Message": "Unit added" });
        //            }
        //        });
        connection.beginTransaction(function(err) {
            if (err) {
                callback({ "Error": true, "Message": err });
            }
            connection.query(query, function(err, rows) {
                if (err) {
                    return connection.rollback(function() {
                        callback({ "Error": true, "Message": err });
                    });
                }
                var lessonId = rows.insertId || request.id;
                query = "DELETE FROM ?? where ?? = ?";
                queryValues = ["lesson_files", "lesson_id", lessonId];
                query = mysql.format(query, queryValues);
                connection.query(query, function(err, rows) {
                    if (err) {
                        return connection.rollback(function() {
                            callback({ "Error": true, "Message": err });
                        });
                    }
                    query = "INSERT INTO ??(??, ??) values ?";
                    queryValues = ["lesson_files", "lesson_id", "file"];
                    var values = [];
                    for (var i = 0; i < request.usersList.length; i++) {
                        values.push([courseId, request.usersList[i]]);
                    }
                    queryValues.push(values);
                    query = mysql.format(query, queryValues);
                    connection.query(query, function(err, rows) {
                        if (err) {
                            return connection.rollback(function() {
                                callback({ "Error": true, "Message": err });
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    callback({ "Error": true, "Message": err });
                                });
                            }
                            callback({ "Error": false, "Message": "Unit added" });
                        });
                    });
                });
            });
        });
    },
    getAllLessons: function(type, id, connection, callback) {
            var query, queryValues;
            if (type == 'all') {
                query = "SELECT * from ??";
                queryValues = ["lessons"];
            } else if (type == 'byUnitId') {
                query = "SELECT * from ?? where ?? IN (SELECT ?? from ?? where ?? = ?)";
                queryValues = ["lessons", "id", "lesson_id", "course_unit_lesson_r", "unit_id", id];
            }
            query = mysql.format(query, queryValues);
            console.log(query)
            connection.query(query, function(err, rows) {
                if (err) {
                    callback({ "Error": true, "Message": err });
                } else {
                    callback({ "Error": false, "Message": "Success", "lessons": rows });
                }
            });
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
