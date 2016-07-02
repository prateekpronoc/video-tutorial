var md5 = require('MD5');

module.exports = function(sequelize) {
    var userModel = require("../model/user.js")(sequelize);
    var User = userModel.User;
    return {
        create: function(req, res) {
            var newUser = {
                email: req.body.email,
                phone: req.body.phone,
                password: md5(req.body.password),
                fullName: req.body.fullName
            };
            User.findOrCreate({ where: { $or: [{ email: newUser.email }, { phone: req.body.phone }] }, defaults: newUser })
                .spread(function(user, created) {
                    if (created) {
                        res.json({ "Error": false, "Message": "User Created" });
                    } else {
                        res.json({ "Error": true, "Message": "User Already Present" });
                    }
                });
        },
        put: function(req, res) {
            if (req.body.id) {
                userId = req.body.id;
                var updateUser = {
                    email: req.body.email,
                    phone: req.body.phone,
                    fullName: req.body.fullName,
                    about: req.body.about,
                    profilePhoto: req.body.profilePhoto,
                    billingAddress: req.body.billingAddress
                };
                User.update(updateUser, { where: { id: userId } })
                    .then(function(result) {
                        res.json({ "Error": false, "Message": "User Updated" });
                    }, function(result) {

                    });
            }
        },
        get: function(req, res) {
            User.findAll().then(function(users) {
                res.send(users);
            });
        },
        login: function(req, res) {
            var user = {};
            if (/^\d{10}$/.test(req.body.email)) {
                user.phone = req.body.email;
            } else {
                user.email = req.body.email;
            }
            user.password = md5(req.body.password);
            console.log(user);
            User.findOne({ where: user, attributes: { exclude: ['password'] } })
                .then(function(result) {
                    if(result)
                        res.json({"Error": false, "Message": "Login credential", "result": result});
                    else
                        res.json({"Error": true, "Message": "Login Failed"});
                });
        }
    };
};
