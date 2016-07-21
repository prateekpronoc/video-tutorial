var queryHelper = require('./queryRunner');
var config = require('./config');
var path = require('path');
var request = require('request');
var watermark = require('image-watermark');
var fs = require('fs');


// function REST_ROUTER(router, connection, md5, jwt, imgUpload, fileUpload) {
//     var self = this;
//     self.handleRoutes(router, connection, md5, jwt, imgUpload, fileUpload);
// }

function REST_ROUTER(router, pool, md5, jwt, imgUpload, fileUpload, database) {
    var self = this;
//    console.log('database', database);
    self.handleRoutes(router, pool, md5, jwt, imgUpload, fileUpload, database);
}

// REST_ROUTER.prototype.handleRoutes = function(router, connection, md5, jwt, imgUpload, fileUpload) {
REST_ROUTER.prototype.handleRoutes = function(router, pool, md5, jwt, imgUpload, fileUpload, database) {

    router.get('/all-user', (req, res) => {
//        console.log('database', database);
        database.user.findAll().then(function(usr) {
            console.log(usr);
            res.send({ test: usr.rows });
        })
        
        // database.user.all().then((usrs) => {
        //     res.users = usrs;
        // });
    });
    // router.get('/all-users'){

    // }
    queryHelper.initdictionaries(pool);
    router.get("/", function(req, res) { /// base route not for use
        res.json({ "Message": "Hello World!" });
    });

    router.post("/user", function(req, res) { /// user signup route
        queryHelper.signup(req.body, pool, md5, function(result) {
            res.json(result);
        });
    });

    router.post("/login", function(req, res) { /// user signin route
        req.body.secretString = config.secret;
        queryHelper.login(req.body, pool, jwt, md5, function(result) {
            res.json(result);
        });
    });

    router.post("/forget", function(req, res) {
        queryHelper.forgetPassword(req.body, pool, function(result) {
            res.json(result);
        });
    });

    router.post("/reset", function(req, res) {
        queryHelper.resetPassword(req.body, pool, md5, function(result) {
            res.json(result);
        });
    });

    router.post("/sendOtp", function(req, res) {
        queryHelper.generatOtp(req.body, function(result) {
            res.json(result);
        });
    });

    router.post("/validateOtp", function(req, res) {
        queryHelper.validatetOtp(req.body, function(result) {
            res.json(result);
        });
    });

    //    router.use(function(req, res, next) {
    //        // check header or url parameters or post parameters for token
    //        var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //        // decode token
    //        if (token) {
    //            // verifies secret and checks exp
    //            jwt.verify(token, config.secret, function(err, decoded) {      
    //                if (err) {
    //                    return res.json({ success: false, message: 'Failed to authenticate token.' });    
    //                } else {
    //                    // if everything is good, save to request for use in other routes
    //                    req.decoded = decoded;    
    //                    next();
    //                }
    //            });
    //        } else {
    //            // if there is no token
    //            // return an error
    //            return res.status(403).send({ 
    //                success: false, 
    //                message: 'No token provided.' 
    //            });
    //        }
    //    });

    router.post("/user/byId", function(req, res) { /// get user by id
        queryHelper.getProfile(req.body, pool, function(result) {
            res.json(result);
        });
    });

    router.post("/user/byType", function(req, res) { /// get user by type
        queryHelper.getAllUsers("byType", req.body.type, pool, function(result) {
            res.json(result);
        });
    });

    router.put("/user", imgUpload, function(req, res) { /// user update router
        if (req && req.files && req.files.file && req.files.file.path)
            req.body.user.profilePhoto = req.protocol + '://' + req.get('host') + '/' + req.files.file.path.substring(req.files.file.path.indexOf('\/'));
        queryHelper.updateUser(req.body.user, pool, function(result) {
            res.json(result);
        });
    });
    /* courses releated routes started */
    router.post("/course", fileUpload, function(req, res) { /// add or update courses with or without instructor
        if (req && req.files && req.files.file && req.files.file.path) {
            //watermark.embedWatermark(path.resolve("./public/filesPath/UsRQqz1Ak53cnbsGm2AxPNkG.pdf"), {'text' : 'sample watermark'});
            req.body.course.filePath = req.protocol + '://' + req.get('host') + req.files.file.path.substring(req.files.file.path.indexOf('\\'));
            req.body.course.fileName = req.files.file.name;
        }
        queryHelper.addUpdateCourse(req.body.course, pool, function(result) {
            // if (result && result.courseId) {
            //     setFileToCorrectLocation(result.courseId, req.protocol, req.get('host'));
            // }
            if (result && result.courseId && req.body.course.units) {
                queryHelper.addUpdateCourseUnit(req.body.course.units, result.courseId, pool, function(result) {
                    res.json(result);
                });
            } else {
                res.json(result);
            }
        });
    });

    router.post("/course/subscribe", function(req, res) {
        var headers = { 'X-Api-Key': config.instamojo.APIKey, 'X-Auth-Token': config.instamojo.AuthToken }
        var payload = {
            purpose: req.body.purpose,
            amount: req.body.amt,
            phone: req.body.phone,
            buyer_name: req.body.fullName,
            redirect_url: 'http://52.66.78.88/#/main/libary',
            send_email: false,
            webhook: 'http://52.66.82.252/api/course/payment',
            send_sms: false,
            email: req.body.email,
            allow_repeated_payments: false
        };
        request.post('https://www.instamojo.com/api/1.1/payment-requests/', { form: payload, headers: headers }, function(error, response, body) {
            if (!error && response.statusCode == 201) {
                var requestLink = JSON.parse(body);
                queryHelper.savePaymentDetails(req.body, requestLink.payment_request, pool, function(result) {
                    if (result && !result.Error)
                        res.json({ 'url': requestLink.payment_request.longurl });
                    else
                        res.json({ "Error": true, "Message": "Try after some time" });
                });
            } else {
                res.json({ "Error": true, "Message": error });
            }
        })
    });

    router.post("/course/payment", function(req, res) {
        queryHelper.savePaymentStatus(req.body, pool, function(result) {
            res.send('done');
        });
    });

    router.post("/course/byId", function(req, res) {
        queryHelper.getCourseById(req.body, pool, function(result) {
            res.json(result);
        });
    });

    router.post("/course/search", function(req, res) {
        queryHelper.searchCourse('byName', req.body, pool, function(result) {
            res.json(result);
        });
    });

    router.get("/course/courseAndUnits", function(req, res) {
        queryHelper.getCourseAndUnits(pool, function(result) {
            res.json(result);
        });
    });

    router.get("/course/all", function(req, res) { /// get all courses
        queryHelper.getAllCourses("all", 0, pool, function(result) {
            res.json(result);
        });
    });

    router.get("/course/allSeasional", function(req, res) { /// get seasional courses
        queryHelper.getAllCourses("allSeasional", 0, pool, function(result) {
            res.json(result);
        });
    });

    router.post("/course/subscribed", function(req, res) { /// get subscribed courses by user id
        queryHelper.getAllCourses("subscribed", req.body.userId, pool, function(result) {
            res.json(result);
        });
    });

    router.post("/course/unsubscribed", function(req, res) { /// get unsubscribed courses by user id
        queryHelper.getAllCourses("unsubscribed", req.body.userId, pool, function(result) {
            res.json(result);
        });
    });
    /* Courses related routes ends*/

    /* Units related routes start */
    router.post("/unit/byCourse", function(req, res) { /// get all units by course
        queryHelper.getAllUnits("byCourseId", req.body.courseId, pool, function(result) {
            res.json(result);
        });
    });
    /* Units related routes ends*/

    /* Lessons related roues starts*/
    router.post("/lesson", fileUpload, function(req, res) { /// create or update lesson
        queryHelper.addUpdateLesson(req.body.lesson, pool, function(result) {
            if (req && req.files && req.files.file && req.body.lesson && result.lessonId) {
                var lessonFiles = {
                    filesList: [],
                    lessonId: result.lessonId
                };
                for (var i = 0; i < req.files.file.length; i++) {
                    var file = {
                        fileName: req.files.file[i].name,
                        filePath: req.protocol + '://' + req.get('host') + req.files.file[i].path.substring(req.files.file[i].path.indexOf('\\'))
                    };
                    lessonFiles.filesList.push(file);
                }
                queryHelper.addFilesToLesson(lessonFiles, pool, function(result) {
                    res.json(result);
                });
            } else {
                res.json(result);
            }
        });
    });

    router.post('/lesson/byId', function(req, res) {
        queryHelper.getLessonById(req.body, pool, function(result) {
            res.json(result);
        });
    });

    router.post("/lesson/addComment", function(req, res) { /// add comment to lesson
        queryHelper.addCommentOnLesson(req.body, pool, function(result) {
            res.json(result);
        });
    });

    router.post("/lesson/allComment", function(req, res) { /// add comment to lesson
        queryHelper.getCommentOnLesson(req.body, pool, function(result) {
            res.json(result);
        });
    });

    router.get("/lesson/all", function(req, res) { /// get all lessons
        queryHelper.getAllLessons(function(result) {
            res.json(result);
        });
    });
    /* Lessons related routes ends*/

    /* Category related routes starts*/
    router.get("/category/all", function(req, res) { /// get all lessons by unit
        queryHelper.getAllCategories("all", 0, pool, function(result) {
            res.json(result);
        });
    });

    router.post("/category", function(req, res) { /// get all lessons by unit
        queryHelper.addCategories(req.body, pool, function(result) {
            res.json(result);
        });
    });
    /* Category related routes ends*/

    router.post("/util/downloadFile", function(req, res) {
        queryHelper.getProfile(req.body, pool, function(result) {
            if (result && result.user.email) {

                // var options = {
                //     keyLength: 40,
                //     password: result.user.email,
                //     restrictions: {
                //         modify: 'n',
                //         extract: 'n'
                //     }
                // };
                // var doc = qpdf.encrypt('http://localhost:3000/filesPath/fA-TGxr-cCGIfMw8gHUcgTvF.pdf', options);
                // doc.pipe(res);
                res.download('http://localhost:3000/filesPath/sGo-xBpvMsUFSNLwPSv9zbke.pdf');
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Access-Control-Allow-Origin': '*',
                    'Content-Disposition': 'inline; filename=' + req.body.fileName
                });
            }
        })
    });

    function setFileToCorrectLocation(id, protocol, host) {
        queryHelper.getCourseFile(id, pool, function(result) {
            if (result && result.files && result.files.length > 0) {
                for (var i = 0; i < result.files.length; i++) {
                    var targetDir = './public/filesPath/' + id + '/';
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir);
                    }
                    var tmp_path = result.files[i].filePath;
                    var target_path = targetDir + result.files[i].fileName;
                    fs.rename(tmp_path, target_path, saveTODB(result.files[i], protocol, host, target_path));
                }
            }
        });

    }

    var saveTODB = function(file, protocol, host, path) {
        return function(error) {
            if (!error) {
                file.filePath = protocol + '://' + host + '/' + path.substring(path.indexOf('filesPath'));
                console.log(file.filePath);
                queryHelper.updateFilePath(file, pool, function(result) {});
            } else {
                console.log('while writting')
            }
        }
    }

}

module.exports = REST_ROUTER;
