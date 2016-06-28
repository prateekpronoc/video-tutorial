var queryHelper = require('./queryRunner');
var config = require('./config');

function REST_ROUTER(router, connection, md5, jwt) {
    var self = this;
    self.handleRoutes(router, connection, md5, jwt);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5, jwt, multipartyMiddleware) {
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

    router.get("/user/:userId", function(req, res) { /// get user by id
        queryHelper.getProfile(req.params, connection, function(result) {
            res.json(result);
        })
    });

    router.post("/user/byType", function(req, res) { /// get user by id
        queryHelper.getAllUsers("byType", req.body.type, connection, function(result) {
            res.json(result);
        })
    });

    router.put("/user", function(req, res) { /// user signup route
        queryHelper.updateUser(req.body, connection, function(result) {
            res.json(result);
        });
    });
    /* courses releated routes started */
    router.post("/course", function(req, res) { /// add or update courses with or without instructor
        queryHelper.addUpdateCourse(req.body, connection, function(result) {
            res.json(result);
        });
    });

    router.get("/course/all", function(req, res) { /// get all courses
        queryHelper.getAllCourses("all", 0, connection, function(result) {
            res.json(result);
        });
    });

    router.get("/course/allRunning", function(req, res) { /// get all regular courses
        queryHelper.getAllCourses("allRunning", 0, connection, function(result) {
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

    //    router.post("/course/addUsers",function(req,res){
    //        queryHelper.addInstructorToCourse(req.body, connection, function(result) {
    //            res.json(result);
    //        });
    //    });
    /* Courses related routes ends*/

    /* Units related routes start */
    router.post("/unit", function(req, res) { /// add or update units
        queryHelper.addUpdateUnitToCourse(req.body, connection, function(result) {
            res.json(result);
        });
    });

    router.get("/unit/all", function(req, res) { /// get all units
        queryHelper.getAllUnits("all", 0, connection, function(result) {
            res.json(result);
        });
    });

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

    router.get("/lesson/all", function(req, res) { /// get all lessons
        queryHelper.getAllLessons("all", 0, connection, function(result) {
            res.json(result);
        });
    });

    router.post("/lesson/byUnit", function(req, res) { /// get all lessons by unit
        queryHelper.getAllLessons("byUnitId", req.body.unitId, connection, function(result) {
            res.json(result);
        });
    });
    /* Lessons related routes ends*/
    // router.post('/user/upload', multipartyMiddleware, function(req, res) {
    //     var file = req.files;
    //     console.log(file.name);
    //     console.log(file.type);
    // });
}

module.exports = REST_ROUTER;
