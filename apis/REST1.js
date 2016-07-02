function REST_ROUTER(router, sequelize, md5, jwt) {
    var self = this;
    
    sequelize.sync();
    self.handleRoutes(router, sequelize, md5, jwt);
}

REST_ROUTER.prototype.handleRoutes = function(router, sequelize, md5, jwt) {
    var userService = require("./modelServices/userServices.js")(sequelize);
    var courseService = require("./modelServices/courseServices.js")(sequelize);

    router.get("/", function(req, res) { /// base route not for use
        res.json({ "Message": "Hello World !" });
    });

    router.get("/user", userService.get);
    router.post("/user", userService.create);
    router.put("/user", userService.put);
    router.post("/login", userService.login);
    router.post("/course", courseService.post);
}

module.exports = REST_ROUTER;
