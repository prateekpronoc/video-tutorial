var mysql = require("mysql");
var _ = require("lodash");
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var moment = require('moment');
var config = require('./config');
var msg91 = require("msg91")(config.msgSms.authKey, config.msgSms.sender, "4");
var speakeasy = require('speakeasy');


var usersList = coursesList = lessonsList = unitsList = forgetList = [];

var self = {
    initdictionaries: function(connection) {
        self.getUsersList(connection);
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
                self.getCoursesList(connection);
            }
        });
    },
    getCoursesList: function(connection) {
        var query = "SELECT c.*, ct.name as category FROM ?? c LEFT JOIN (categories ct) ON ct.id = c.categoryId WHERE c.isDeleted = false";
        var queryValues = ["courses"];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                _.forEach(rows, function(value, key) {
                    value.instructors = [];
                });
                coursesList = rows;
                self.getCourseInstructors(connection);
            }
        })
    },
    getCourseInstructors: function(connection) {
        var query = "SELECT ui.* FROM ?? ui WHERE ui.isDeleted = false";
        var queryValues = ["courses_instructor"];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (rows && rows.length > 0) {
                _.forEach(rows, function(value, key) {
                    var course = _.find(coursesList, { 'id': value.courseId });
                    if (course) {
                        course.instructors = course.instructors || [];
                        var user = _.find(usersList, { 'id': value.userId });
                        if (user) {
                            value.fullName = user ? user.fullName : '';
                            course.instructors.push(value);
                        }
                    }
                });
            }
        })
    },
    getUnitsList: function(connection) {
        var query = "SELECT u.id, u.name FROM ?? u WHERE u.isDeleted = false";
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
        var query = "SELECT * FROM ?? l WHERE l.isDeleted = false";
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
            query = "SELECT * FROM ?? where lessonId = ?";
            queryValues = ["lesson_comments", id];
        } else {
            query = "SELECT * FROM ??";
            queryValues = ["lesson_comments"];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (rows && rows.length > 0) {
                _.forEach(rows, function(value, key) {
                    var lesson = _.find(lessonsList, { 'id': value.lessonId });
                    if (lesson) {
                        lesson.comments = lesson.comments || [];
                        var user = _.find(usersList, { 'id': value.userId });
                        value.commentedBy = {
                            profilePhoto: user.profilePhoto,
                            fullName: user.fullName
                        };
                        lesson.comments.push(value);
                    }
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
                    var lesson = _.find(lessonsList, { 'id': value.lessonId });
                    if (lesson) {
                        lesson.files = lesson.files || [];
                        lesson.files.push(value);
                    }
                });
            }
        });
    },
    findUser: function(request, connection, callback) {
        request.email = request.email || null;
        request.phone = request.phone || null;
        var query = "SELECT id, email, phone FROM ?? WHERE ??=? or ??=?";
        var queryValues = ["user", "email", request.email, "phone", request.phone];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else if (rows && rows.length > 0) {
                var isEmail = _.find(rows, { 'email': request.email }) ? true : false;
                var isPhone = _.find(rows, { 'phone': request.phone }) ? true : false;
                callback({ "Error": false, "Message": "Email/Phone already in use", "Code": 1, "isEmail": isEmail, "isPhone": isPhone });
            } else {
                callback({ "Error": false, "Message": "User Not Present", "Code": 0 });
            }
        });
    },
    signup: function(request, connection, md5, callback) { /// for new user signup
        var query, queryValues;
        var data = {
            email: request.email,
            phone: request.phone
        };
        self.findUser(data, connection, function(result) {
            if (result && !result.Error && !result.Code) {
                query = "INSERT INTO ??(??,??, ??, ??, ??) VALUES (?,?, ?, ?, ?)";
                queryValues = ["user", "email", "phone", "password", "fullName", "profileType", request.email, request.phone, md5(request.password), request.fullName, request.profileType];
                query = mysql.format(query, queryValues);
                connection.query(query, function(err, rows) {
                    if (err) {
                        callback({ "Error": true, "Message": err });
                    } else {
                        callback({ "Error": false, "Message": "User Added" });
                    }
                });
            } else if (result && !result.Error && result.Code) {
                result.Error = true
                callback(result);
            } else {
                callback({ "Error": true, "Message": "Error occured, Please try after some time" });
            }
        });
    },
    login: function(request, connection, jwt, md5, callback) { /// for login to app
        var loginIdField = /^\d+$/.test(request.userName) ? 'phone' : 'email';
        var query = "SELECT * FROM ?? WHERE ??=? && ??=?";
        var queryValues = ["user", loginIdField, request.userName, "password", md5(request.password)];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": "Error executing MySQL query" });
            } else if (rows && rows.length > 0) {
                var token = jwt.sign(rows[0], request.secretString, {
                    expiresIn: "1d" // expires in 24 hours
                });
                rows = rows[0];
                delete rows.password;
                callback({ "Error": false, "Message": "Success", "token": token, "result": rows });
            } else {
                callback({ "Error": true, "Message": "Email/Phone or Password is in correct" });
            }
        });
    },
    forgetPassword: function(request, connection, callback) {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                var query = "SELECT id from ?? where email=?";
                var queryValues = ["user", request.email];
                query = mysql.format(query, queryValues);
                connection.query(query, function(err, rows) {
                    if (rows && rows.length > 0) {
                        var user = rows[0];

                        user.token = token;
                        user.expires = moment().add(1, 'h'); // 1 hour
                        forgetList.push(user);
                        //user.save(function(err) {
                        done(err, token);
                        //});
                    } else if (rows && rows.length == 0) {
                        callback({ "Error": true, "Message": "No account with that email address exists" });
                    } else {
                        callback({ "Error": true, "Message": "Some error occured, Please try again after some time" });
                    }
                });
            },
            function(token, done) {
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'rohan@stellardigital.in', // Your email id
                        pass: '123rohan' // Your password
                    }
                });
                var mailOptions = {
                    from: 'rohan@stellardigital.in', // sender address
                    to: request.email, // list of receivers
                    subject: 'Email Example', // Subject line
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        request.host + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                transporter.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        callback({ "Error": true, "Message": err });
                    } else {
                        callback({ "Error": false, "Message": "Success", "Info": info });
                    };
                });
            }
        ], function(err) {
            if (err)
                callback({ "Error": true, "Message": err });
        });
    },
    resetPassword: function(request, connection, md5, callback) {
        var user = _.find(forgetList, function(value) {
            return value.token == request.token && moment().isBefore(value.expires)
        });
        if (!user) {
            callback({ "Error": true, "Message": "Password reset token is invalid or has expired" });
        } else {
            var query = "UPDATE ?? SET password=? WHERE id=?";
            var queryValues = ["user", md5(request.password), user.id];
            query = mysql.format(query, queryValues);
            connection.query(query, function(err, rows) {
                if (err) {
                    callback({ "Error": true, "Message": err });
                } else {
                    callback({ "Error": false, "Message": "Success" });
                }
            });
        }
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
                callback({ "Error": true, "Message": err });
            } else {
                callback({ "Error": false, "Message": "User Updated", 'user': request });
            }
        });
    },
    generatOtp: function(request, callback) {
        // var secret = totp.utils.generateSecret();
        // var code = totp.generate(secret);
        var secret = speakeasy.generateSecret();
        secret = secret.base32;
        var code = speakeasy.totp({
            secret: secret,
            encoding: 'base32',
            step: 120
        });
        //callback({ "Error": false, "secret": secret, "code": code });
        msg91.send(request.phone, "Your OTP:" + code, function(err, response) {
            if (err) {
                callback({ "Error": true, "Message": "Unable to send message to phone number" });
            } else {
                callback({ "Error": false, "secret": secret, "code": code });
            }
            msg91.getBalance(function(err, msgCount) {
                console.log(err);
                console.log(msgCount);
            });
        });

    },
    validatetOtp: function(request, callback) {
        //var status = totp.check(request.code, request.secret);
        var status = speakeasy.totp.verify({
            secret: request.secret,
            encoding: 'base32',
            token: request.code,
            step: 120
        });
        if (status)
            callback({ "Error": false, "Message": "Correct code" });
        else
            callback({ "Error": true, "Message": "Incorrect code" });
    },
    savePaymentDetails: function(req, paymentInfo, connection, callback) {
        var query = "INSERT INTO ??(??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        var queryValues = ["payment_details", "payment_request_id", "phone", "purpose", "amount", "email", "fullName", "userId", "courseId", paymentInfo.id, req.phone, req.purpose, req.amt, req.email, req.fullName, req.userId, req.courseId];
        query = mysql.format(query, queryValues);
        connection.beginTransaction(function(err) {
            if (err) {
                callback(err);
            }
            connection.query(query, function(err, rows) {
                if (err) {
                    return connection.rollback(function() {
                        callback({ "Error": true });
                    });
                }
                query = "INSERT INTO ??(??, ??) values (?, ?)";
                queryValues = ["payment_log", "payment_request_id", "status", paymentInfo.id, paymentInfo.status];
                query = mysql.format(query, queryValues);
                connection.query(query, function(err, rows) {
                    if (err) {
                        return connection.rollback(function() {
                            callback({ "Error": true });
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback({ "Error": true });
                            });
                        }
                        callback({ "Error": false });
                    });
                });
            });
        });
    },
    savePaymentStatus: function(request, connection, callback) {
        var query, queryValues;
        query = "INSERT INTO ??(??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)";
        queryValues = ["payment_log", "payment_request_id", "payment_id", "fees", "mac", "status", request.payment_request_id, request.payment_id, request.fees, request.mac, request.status];
        query = mysql.format(query, queryValues);
        connection.beginTransaction(function(err) {
            if (err) {
                callback(err);
            }
            connection.query(query, function(err, rows) {
                if (err) {
                    return connection.rollback(function() {
                        callback({ "Error": true });
                    });
                }
                if (request.status.toLowerCase() == 'credit') {
                    query = "INSERT INTO ??(??, ??) SELECT courseId, userId FROM payment_details WHERE payment_request_id = ?";
                    queryValues = ["course_subscription", "courseId", "userId", request.payment_request_id];
                    query = mysql.format(query, queryValues);
                    connection.query(query, function(err, rows) {
                        if (err) {
                            return connection.rollback(function() {
                                callback({ "Error": true });
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    callback({ "Error": true });
                                });
                            }
                            callback({ "Error": false });
                        });
                    });
                } else {
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback({ "Error": true });
                            });
                        }
                        callback({ "Error": false });
                    });
                }
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
                query = "INSERT INTO ??(??, ??, ??, ??) values ? ON DUPLICATE KEY UPDATE isDeleted=VALUES(isDeleted)";
                queryValues = ["courses_instructor", "id", "courseId", "userId", "isDeleted"];
                var values = [];
                for (var i = 0; i < request.instructors.length; i++) {
                    values.push([request.instructors[i].id, courseId, request.instructors[i].userId, (request.instructors[i].isDeleted == 'true')]);
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
                        callback(err, rows, courseId);
                    });
                });
            });
        });
    },
    addUpdateCourse: function(request, connection, callback) { /// update or add course
        var query, queryValues;
        query = "INSERT INTO ??(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE isDeleted=VALUES(isDeleted), name=VALUES(name), description=VALUES(description), demoVideo=VALUES(demoVideo), demoPoster=VALUES(demoPoster), subscriptionFee=VALUES(subscriptionFee), categoryId=VALUES(categoryId), filePath=VALUES(filePath), fileName=VALUES(fileName), validTo=VALUES(validTo)";
        queryValues = ["courses", "id", "name", "description", "demoVideo", "demoPoster", "filePath", "fileName", "subscriptionFee", "categoryId", "isDeleted", "validTo", request.id, request.name, request.description, request.demoVideo, request.demoPoster, request.filePath, request.fileName, request.subscriptionFee, request.categoryId, (request.isDeleted == 'true'), request.validTo];
        query = mysql.format(query, queryValues);
        console.log(query);
        if (request.instructors && request.instructors.length > 0) {
            self.addCourseWithUsers(query, request, connection, function(err, rows, courseId) {
                if (err) {
                    callback({ "Error": true, "Message": err });
                } else {
                    self.getCoursesList(connection);
                    callback({ "Error": false, "Message": "Course Added", "courseId": courseId });
                }
            });
        } else {
            connection.query(query, function(err, rows, courseId) {
                if (err) {
                    callback({ "Error": true, "Message": err });
                } else {
                    self.getCoursesList(connection);
                    callback({ "Error": false, "Message": "Course Added", "courseId": courseId });
                }
            });
        }
    },
    searchCourse: function(type, request, connection, callback) {
        var query, queryValues;
        if (type == "byName") {
            query = "SELECT c.id, sum(l.duration) as courseDuration from ?? c LEFT JOIN (course_unit_lesson_r cul, lessons l) ON cul.courseId = c.id and l.id = cul.lessonId WHERE c.isDeleted = false AND c.name LIKE '%" + request.name + "%' GROUP BY c.id";
            queryValues = ["courses"];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                var result = [];
                _.forEach(rows, function(value, key) {
                    var course = _.find(coursesList, { 'id': value.id });
                    course.duration = value.courseDuration;
                    result.push(course);
                });
                callback({ "Error": false, "Message": "Success", "courses": result });
            }
        });
    },
    getCourseById: function(request, connection, callback) {
        var query = "SELECT u.*, sum(l.duration) as unitDuration from ?? u LEFT JOIN (tutorialsdb.course_unit_lesson_r cul, tutorialsdb.lessons l) on u.id = cul.unitId and l.id = cul.lessonId where u.isDeleted = false AND u.courseId = ? group by u.id";
        var queryValues = ["units", request.courseId];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                var result = _.find(coursesList, { 'id': request.courseId });
                result.duration = _.sum(_.map(rows, 'unitDuration'));
                result.units = rows;
                callback({ "Error": false, "Message": "Success", "course": result });
            }
        });
    },
    getCourseAndUnits: function(connection, callback) {
        var query = "SELECT c.id, c.name, GROUP_CONCAT(u.id) as unitList from ?? c LEFT JOIN (units u) ON c.id = u.courseId GROUP BY c.id";
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
            query = "SELECT c.id, sum(l.duration) as courseDuration from ?? c LEFT JOIN (course_unit_lesson_r cul, lessons l) ON cul.courseId = c.id and l.id = cul.lessonId WHERE c.isDeleted = false GROUP BY c.id";
            queryValues = ["courses"];
        } else if (type == "subscribed") {
            query = "SELECT c.id, sum(l.duration) as courseDuration from ?? c LEFT JOIN (course_unit_lesson_r cul, lessons l) ON cul.courseId = c.id and l.id = cul.lessonId where c.isDeleted = false AND c.id IN (select ?? from course_subscription where ?? = ?) GROUP BY c.id";
            queryValues = ["courses", "courseId", "userId", id];
        } else if (type == "unsubscribed") {
            query = "SELECT c.id, sum(l.duration) as courseDuration from ?? c LEFT JOIN (course_unit_lesson_r cul, lessons l) ON cul.courseId = c.id and l.id = cul.lessonId where c.isDeleted = false AND c.id NOT IN (select ?? from course_subscription where ?? = ?) GROUP BY c.id";
            queryValues = ["courses", "courseId", "userId", id];
        }
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                var result = [];
                _.forEach(rows, function(value, key) {
                    var course = _.find(coursesList, { 'id': value.id });
                    course.duration = value.courseDuration;
                    result.push(course);
                });
                callback({ "Error": false, "Message": "Success", "courses": result });
            }
        });
    },
    addUpdateCourseUnit: function(request, courseId, connection, callback) {
        var query, queryValues;
        var updateList = _.filter(request, 'id');
        var insertList = _.filter(request, function(o) {
            return !o.id;
        });
        if (request && request.length > 0) {
            query = "INSERT INTO ??(??, ??, ??, ??, ??) values ? ON DUPLICATE KEY UPDATE name=VALUES(name), courseId=VALUES(courseId), isDeleted=VALUES(isDeleted)";
            queryValues = ["units", "id", "name", "description", "courseId", "isDeleted"];
            var values = [];
            for (var i = 0; i < request.length; i++) {
                values.push([request[i].id, request[i].name, request[i].name, courseId, (request[i].isDeleted == 'true')]);
            }
            queryValues.push(values);
            query = mysql.format(query, queryValues);
            connection.query(query, function(err, rows) {
                if (err) {
                    callback({ "Error": true, "Message": err });
                } else {
                    self.getUnitsList(connection);
                    callback({ "Error": false, "Message": "Success" });
                }
            });
        }
    },
    getAllUnits: function(type, id, connection, callback) { /// get list of units(by course id)
        var query, queryValues;
        if (type == 'byCourseId') {
            query = "SELECT u.*, GROUP_CONCAT(cul.lessonId) as lessonList from ?? u LEFT JOIN (course_unit_lesson_r cul) ON u.id = cul.unitId where u.courseId = ? AND u.isDeleted = false GROUP BY u.id";
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
        query = "INSERT INTO ??(??, ??, ??, ??, ??, ??, ??) values (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), video=VALUES(video), duration=VALUES(duration), isDeleted=VALUES(isDeleted), poster=VALUES(poster)";
        queryValues = ["lessons", "id", "name", "description", "video", "duration", "isDeleted", "poster", request.id, request.name, request.description, request.video, request.duration, (request.isDeleted == 'true'), request.poster];
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
                if (request.courses && request.courses.length > 0) {
                    query = "INSERT INTO ??(??, ??, ??, ??) values (?, ?, ?, ?) ON DUPLICATE KEY UPDATE courseId=VALUES(courseId), lessonId=VALUES(lessonId), unitId=VALUES(unitId)";
                    queryValues = ["course_unit_lesson_r", "id", "lessonId", "courseId", "unitId", request.courses[0].id, lessonId, request.courses[0].courseId, request.courses[0].unitId];
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
                            self.getLessonsList(connection);
                            callback({ "Error": false, "Message": "Lesson added", "lessonId": lessonId });
                        });
                    });
                } else {
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback({ "Error": true, "Message": err });
                            });
                        }
                        self.getLessonsList(connection);
                        callback({ "Error": false, "Message": "Lesson added", "lessonId": lessonId });
                    });
                }
            });
        });
    },
    addFilesToLesson: function(request, connection, callback) {
        var query = "INSERT INTO ??(??, ??, ??) values ?";
        var queryValues = ["lesson_files", "lessonId", "fileName", "filePath"];
        var values = [];
        for (var i = 0; i < request.filesList.length; i++) {
            values.push([request.lessonId, request.filesList[i].fileName, request.filesList[i].filePath]);
        }
        queryValues.push(values);
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                self.getLessonsFiles(connection);
                callback({ "Error": false, "Message": "Success" });
            }
        });
    },
    getLessonById: function(request, connection, callback) {
        var query = "SELECT * FROM ?? cul where cul.lessonId = ?";
        var queryValues = ["course_unit_lesson_r", request.lessonId];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                var result = _.cloneDeep(_.find(lessonsList, { 'id': request.lessonId }));
                if (result) {
                    result.courses = [];
                    if (rows && rows.length > 0) {
                        _.forEach(rows, function(value, key) {
                            value.courseName = _.cloneDeep(_.find(coursesList, { 'id': value.courseId }).name);
                            value.unitName = _.cloneDeep(_.find(unitsList, { 'id': value.unitId }).name);
                            result.courses.push(value);
                        });
                    }
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
        var queryValues = ["lesson_comments", "lessonId", "userId", "comments", request.lessonId, request.userId, request.comment];
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
    getCommentOnLesson: function(request, connection, callback) { /// get lesson comments by id
        var lesson = _.find(lessonsList, { 'id': request.lessonId });
        var comments = [];
        if (lesson) {
            comments = lesson.comments;
            callback({ "Error": false, "Message": "Success", "comments": comments });
        } else {
            callback({ "Error": true, "Message": "Comments Not Found" });
        }
    },
    getAllCategories: function(type, id, connection, callback) { /// get list of all category
        var query, queryValues;
        if (type = "all") {
            query = "SELECT ct.*, count(c.id) as coursesCount FROM ?? ct LEFT JOIN (courses c) ON c.categoryId = ct.id GROUP BY ct.id";
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
    },
    addCategories: function(request, connection, callback) {
        var query = "INSERT INTO ??(??) VALUES (?)";
        var queryValues = ["categories", "name", request.name];
        query = mysql.format(query, queryValues);
        connection.query(query, function(err, rows) {
            if (err) {
                callback({ "Error": true, "Message": err });
            } else {
                callback({ "Error": false, "Message": "Success" });
            }
        })
    }
};

module.exports = self;
