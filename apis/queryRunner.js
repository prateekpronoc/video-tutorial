var mysql = require("mysql");
var _ = require("lodash");
var usersList = coursesList = lessonsList = unitsList = [];

var self = {
    initdictionaries: function(connection) {
        self.getUsersList(connection);
        self.getCoursesList(connection);
        self.getUnitsList(connection);
        self.getLessonsList(connection);
    },
    getUsersList: function(connection) {
        var query = "SELECT * FROM ??";
        var queryValues = ["user"];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                usersList = rows;
            }
        });
    },
    getCoursesList: function(connection) {
        var query = "SELECT c.*, ct.name as category FROM ?? c LEFT JOIN (categories ct) ON ct.id = c.categoryId";
        var queryValues = ["courses"];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                coursesList = rows;
            }
        })
    },
    getUnitsList: function(connection) {
        var query = "SELECT u.id, u.name FROM ?? u";
        var queryValues = ["units"];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                unitsList = rows;
            }
        })
    },
    getLessonsList: function(connection) {
        var query = "SELECT * FROM ??";
        var queryValues = ["lessons"];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                lessonsList = rows;
                self.getLessonsComments(connection);
                self.getLessonsFiles(connection);
            }
        })
    },
    getLessonsComments: function(connection, id) {
        var query, queryValues;
        if (id) {
            query = "SELECT * FROM ?? where lesson_id = ?";
            queryValues = ["lesson_comments", id];
        } else {
            query = "SELECT * FROM ??";
            queryValues = ["lesson_comments"];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (rows && rows.length > 0) {
                _.forEach(rows, function(value, key) {
                    var lesson = _.find(lessonsList, { 'id': value.lesson_id });
                    lesson.comments = lesson.comments || [];
                    value.user = _.find(usersList, { 'id': value.user_id }).fullName;
                    lesson.comments.push(value);
                });
            }
        });
    },
    getLessonsFiles: function(connection) {
        var query = "SELECT * FROM ??";
        var queryValues = ["lesson_files"];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (rows && rows.length > 0) {
                _.forEach(rows, function(value, key) {
                    var lesson = _.find(lessonsList, { 'id': value.lesson_id });
                    lesson.files = lesson.files || [];
                    lesson.files.push(value);
                });
            }
        });
    },
    signup: function(request, connection, md5, callback) { /// for new user signup
        var query = "INSERT INTO ??(??,??, ??, ??) VALUES (?,?, ?, ?)";
        var queryValues = ["user", "email", "phone", "password", "fullName", request.email, request.phone, md5(request.password), request.fullName];
        query = mysql.format(query, queryValues);
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                callback({ "Error": false, "Message": "User Added" });
            }
        });
    },
    login: function(request, connection, jwt, md5, callback) { /// for login to app
        var loginIdField = /^\d{10}$/.test(request.email) ? 'phone' : 'email';
        var query = "SELECT * FROM ?? WHERE ??=? && ??=?";
        var queryValues = ["user", loginIdField, request.email, "password", md5(request.password)];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                var token = jwt.sign(rows[0], request.secretString, {
                    expiresIn: "1d" // expires in 24 hours
                });
                rows = rows[0];
                delete rows.password;
                callback({ "Error": false, "Message": "Success", "token": token, "result": rows });
            }
        });
    },
    getProfile: function(request, connection, callback) { /// get user info by id
        var query = "SELECT * FROM user where id=?";
        var queryValues = [request.userId];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                rows = rows[0];
                delete rows.password;
                callback({ "Error": false, "Message": "Success", "user": rows });
            }
        });
    },
    getAllUsers: function(type, value, connection, callback) { /// get list all users
        var query, queryValues;
        if (type == "byType") {
            query = "SELECT * from ?? where profileType = ?";
            queryValues = ["user", value];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                callback({ "Error": false, "Message": "Success", "users": rows });
            }
        });
    },
    updateUser: function(request, connection, callback) { /// update user profile
        var query = "UPDATE ?? SET ? where ?? = ?";
        var queryValues = ["user", { "email": request.email, "phone": request.phone, "fullName": request.fullName, "about": request.about, "billingAddress": request.billingAddress, "profilePhoto": request.profilePhoto, "status": request.status }, "id", request.id];
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
                callback({ "Error": false, "Message": "User Updated", 'user': request });
            });
        });
    },
    addCourseWithUsers: function(query, request, connection, callback) { /// to add users to course
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
    addUpdateCourse: function(request, connection, callback) { /// update or add course
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
    getCourseById: function(request, connection, callback) {
        var query = "SELECT * from ?? u where u.id IN (SELECT cul.unit_id FROM course_unit_lesson_r cul where cul.course_id = ?)";
        var queryValues = ["units", request.courseId];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                var result = _.find(coursesList, { 'id': request.courseId });
                result.units = rows;
                callback({ "Error": false, "Message": "Success", "course": result });
            }
        });
    },
    getCourseAndUnits: function(connection, callback) {
        var query = "SELECT c.id, c.name, GROUP_CONCAT(cul.unit_id) as unitList from ?? c LEFT JOIN (course_unit_lesson_r cul) ON c.id = cul.course_id GROUP BY c.id";
        var queryValues = ["courses"];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                _.forEach(rows, function(value, key) {
                    value.units = [];
                    if (value.unitList && value.unitList.length > 0) {
                        _.forEach(value.unitList.split(','), function(childValue, childKey) {
                            var unit = _.cloneDeep(_.find(unitsList, { 'id': parseInt(childValue) }));
                            value.units.push(unit);
                        });
                    }
                    //delete value.unitList;
                });
                callback({ "Error": false, "Message": "Success", "courses": rows });
            }
        });
    },
    getAllCourses: function(type, id, connection, callback) { /// get list of course(all/subscribed/unsubscribed)
        var query, queryValues;
        if (type == "all") {
            query = "SELECT c.id, GROUP_CONCAT(ci.user_id) as instructorList from ?? c LEFT JOIN (courses_instructor ci) ON c.id = ci.course_id GROUP BY c.id";
            queryValues = ["courses"];
        } else if (type == "subscribed") {
            query = "SELECT c.id, GROUP_CONCAT(ci.user_id) as instructorList from ?? c JOIN (courses_instructor ci) ON c.id = ci.course_id and c.id IN (select ?? from course_subscription where ?? = ?) GROUP BY c.id";
            queryValues = ["courses", "course_id", "user_id", id];
        } else if (type == "unsubscribed") {
            query = "SELECT c.id, GROUP_CONCAT(ci.user_id) as instructorList from ?? c JOIN (courses_instructor ci) ON c.id = ci.course_id and c.id NOT IN (select ?? from course_subscription where ?? = ?) GROUP BY c.id";
            queryValues = ["courses", "course_id", "user_id", id];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                var result = [];
                _.forEach(rows, function(value, key) {
                    var course = _.find(coursesList, { 'id': value.id });
                    course.instructors = [];
                    if (value.instructorList) {
                        _.forEach(value.instructorList.split(","), function(childValue, childKey) {
                            var user = _.find(usersList, { 'id': parseInt(childValue) });
                            if (user) {
                                delete user.password;
                                course.instructors.push(user);
                            }
                        });
                    }
                    result.push(course);
                });
                callback({ "Error": false, "Message": "Success", "courses": result });
            }
        });
    },
    getAllUnits: function(type, id, connection, callback) { /// get list of units(by course id)
        var query, queryValues;
        if (type == 'byCourseId') {
            query = "SELECT u.*, GROUP_CONCAT(cul.lesson_id) as lessonList from ?? u JOIN (course_unit_lesson_r cul) ON cul.course_id = ? and u.id = cul.unit_id GROUP BY u.id";
            queryValues = ["units", id];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                _.forEach(rows, function(value, key) {
                    value.lessons = [];
                    if (value.lessonList) {
                        _.forEach(value.lessonList.split(",").sort(), function(childValue, childKey) {
                            var lesson = _.find(lessonsList, { 'id': parseInt(childValue) });
                            if (lesson) {
                                value.lessons.push(lesson);
                            }
                        });
                    }
                    delete value.lessonList;
                });
                callback({ "Error": false, "Message": "Success", "units": rows });
            }
        });
    },
    addUpdateLesson: function(request, connection, callback) { /// add update lesson
        var query, queryValues;
        if (request.id) {
            query = "UPDATE ?? SET ? where ?? = ?";
            queryValues = ["lessons", { "name": request.name, "description": request.description, "video": request.video, "air_date": request.airDate }, "id", request.id];
        } else {
            query = "INSERT INTO ??(??, ??, ??, ??) values (?, ?, ?, ?)";
            queryValues = ["lessons", "name", "description", "video", "air_date", request.name, request.description, request.video, request.airDate];
        }
        query = mysql.format(query, queryValues);
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
    getLessonById: function(request, connection, callback) {
        var query = "SELECT * FROM ?? cul where cul.lesson_id = ?";
        var queryValues = ["course_unit_lesson_r", request.lessonId];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                var result = _.cloneDeep(_.find(lessonsList, { 'id': request.lessonId }));
                result.courses = [];
                if (rows && rows.length > 0) {
                    _.forEach(rows, function(value, key) {
                        var course = {
                            id: value.course_id,
                            name: _.cloneDeep(_.find(coursesList, { 'id': value.course_id }).name),
                            unit: _.cloneDeep(_.find(unitsList, { 'id': value.unit_id }))
                        };
                        result.courses.push(course);
                    });
                }
                callback({ "Error": false, "Message": "Success", "lesson": result });
            }
        });
    },
    getAllLessons: function(callback) { /// get list all lessons
        if (lessonsList) {
            callback({ "Error": false, "Message": "Success", "lessons": lessonsList });
        }
    },
    addCommentOnLesson: function(request, connection, callback) { /// insert comment to lesson
        var query = "INSERT INTO ??(??, ??, ??) values (?, ?, ?)";
        var queryValues = ["lesson_comments", "lesson_id", "user_id", "comments", request.lessonId, request.userId, request.comment];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                self.getLessonsComments(connection, request.lessonId);
                callback({ "Error": false, "Message": "Success" });
            }
        });
    },
    getAllCategories: function(type, id, connection, callback) { /// get list of all category
        var query, queryValues;
        if (type = "all") {
            query = "SELECT * FROM ??";
            queryValues = ["categories"];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                callback({ "Error": false, "Message": "Success", "categories": rows });
            }
        });
    }
};

module.exports = self;
