var queryHelper = require('./queryRunner');
var config = require('./config');
var path = require('path');

function REST_ROUTER(router, connection, md5, jwt, multipartyMiddleware) {
    var self = this;
    self.handleRoutes(router, connection, md5, jwt, multipartyMiddleware);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5, jwt, multipartyMiddleware) {
    queryHelper.initdictionaries(connection);
    router.get("/", function(req, res) { /// base route not for use
        res.json({ "Message": "Hello World !" });
    });

    router.post("/user", function(req, res) { /// user signup route
        queryHelper.signup(req.body, connection, md5, function(result) {
            res.json(result);
        });
    });

    router.post("/login", function(req, res) { /// user signin route
        req.body.secretString = config.secret;
        queryHelper.login(req.body, connection, jwt, md5, function(result) {
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
        queryHelper.getProfile(req.body, connection, function(result) {
            res.json(result);
        })
    });

    router.post("/user/byType", function(req, res) { /// get user by type
        queryHelper.getAllUsers("byType", req.body.type, connection, function(result) {
            res.json(result);
        })
    });

    router.put("/user", multipartyMiddleware, function(req, res) { /// user update router
        if(req && req.files && req.files.file && req.files.file.path)
            req.body.user.profilePhoto = req.files.file.path.substring(req.files.file.path.indexOf('\\'));
        queryHelper.updateUser(req.body.user, connection, function(result) {
            res.json(result);
        });
    });
    /* courses releated routes started */
    router.post("/course", function(req, res) { /// add or update courses with or without instructor
        queryHelper.addUpdateCourse(req.body, connection, function(result) {
            res.json(result);
        });
    });

    router.post("/course/byId", function(req, res) {
        queryHelper.getCourseById(req.body, connection, function(result) {
            res.json(result);
        });
    });

    router.get("/course/courseAndUnits", function(req, res) {
        queryHelper.getCourseAndUnits(connection, function(result) {
            res.json(result);
        });
    });

    router.get("/course/all", function(req, res) { /// get all courses
        queryHelper.getAllCourses("all", 0, connection, function(result) {
            res.json(result);
        });
    });

    router.get("/course/allSeasional", function(req, res) { /// get seasional courses
        queryHelper.getAllCourses("allSeasional", 0, connection, function(result) {
            res.json(result);
        });
    });

    router.post("/course/subscribed", function(req, res) { /// get subscribed courses by user id
        queryHelper.getAllCourses("subscribed", req.body.userId, connection, function(result) {
            res.json(result);
        });
    });

    router.post("/course/unsubscribed", function(req, res) { /// get unsubscribed courses by user id
        queryHelper.getAllCourses("unsubscribed", req.body.userId, connection, function(result) {
            res.json(result);
        });
    });
    /* Courses related routes ends*/

    /* Units related routes start */
    router.post("/unit/byCourse", function(req, res) { /// get all units by course
        queryHelper.getAllUnits("byCourseId", req.body.courseId, connection, function(result) {
            res.json(result);
        });
    });
    /* Units related routes ends*/

    /* Lessons related roues starts*/
    router.post("/lesson", function(req, res) { /// create or update lesson
        queryHelper.addUpdateLesson(req.body, connection, function(result) {
            res.json(result);
        });
    });

    router.post('/lesson/byId', function(req, res) {
        queryHelper.getLessonById(req.body, connection, function(result) {
            res.json(result);
        });
    });

    router.post("/lesson/addComment", function(req, res) { /// add comment to lesson
        queryHelper.addCommentOnLesson(req.body, connection, function(result) {
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
        queryHelper.getAllCategories("all", 0, connection, function(result) {
            res.json(result);
        });
    });
    /* Category related routes ends*/

    router.post('/upload', multipartyMiddleware, function(req, res) {
        console.log(req.body, req.files);
        
    });
}

module.exports = REST_ROUTER;
