var queryHelper = require('./queryRunner');
var config = require('./config');

function REST_ROUTER(router,connection,md5,jwt) {
    var self = this;
    self.handleRoutes(router,connection,md5,jwt);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5,jwt) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });
    router.post("/user",function(req,res){
        queryHelper.signup(req.body, connection, md5, function(result) {
            res.json(result);
        });
    });
    
    router.post("/login",function(req,res){
        req.body.secretString = config.secret;
        queryHelper.login(req.body, connection, jwt, md5, function(result){
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

    router.get("/user/:userId",function(req,res){
        queryHelper.getProfile(req.params, connection, function(result){
            res.json(result);
        })
    });
    
    router.post("/course",function(req,res){
        queryHelper.addUpdateCourse(req.body, connection, function(result) {
            res.json(result);
        });
    });
    
    router.get("/course/all",function(req,res){
        queryHelper.getAllCourses("all", 0, connection, function(result) {
            res.json(result);
        });
    });
    
    router.get("/course/allRunning",function(req,res){
        queryHelper.getAllCourses("allRunning", 0, connection, function(result) {
            res.json(result);
        });
    });
    
    router.get("/course/allSeasional",function(req,res){
        queryHelper.getAllCourses("allSeasional", 0, connection, function(result) {
            res.json(result);
        });
    });
    
    router.post("/course/subscribed",function(req,res){
        queryHelper.getAllCourses("subscribed", req.body.userId, connection, function(result) {
            res.json(result);
        });
    });
    
    router.post("/course/unsubscribed",function(req,res){
        queryHelper.getAllCourses("unsubscribed", req.body.userId, connection, function(result) {
            res.json(result);
        });
    });
    
    router.post("/unit",function(req,res){
        queryHelper.addUpdateUnitToCourse(req.body, connection, function(result) {
            res.json(result);
        });
    });
    
//    router.post("/course/addUsers",function(req,res){
//        queryHelper.addInstructorToCourse(req.body, connection, function(result) {
//            res.json(result);
//        });
//    });
}

module.exports = REST_ROUTER;