function REST_ROUTER(router, sequelize, md5, jwt) {
    var self = this;
    
    sequelize.sync();
    self.handleRoutes(router, sequelize, md5, jwt);
}

REST_ROUTER.prototype.handleRoutes = function(router, sequelize, md5, jwt) {
    var userService = require("./modelServices/userServices.js")(sequelize);

    router.get("/", function(req, res) { /// base route not for use
        res.json({ "Message": "Hello World !" });
    });

    router.get("/users", userService.get);
    router.post("/users", userService.create);
    router.put("/users", userService.put);
}

module.exports = REST_ROUTER;
