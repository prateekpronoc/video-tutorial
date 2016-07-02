module.exports = function(sequelize) {
    var userModel = require("../model/user.js")(sequelize);
    var userInfoModel = require("../model/userInfo.js")(sequelize);
    var User = userModel.User;
    var UserInfo = userInfoModel.UserInfo;
    User.hasOne(UserInfo);
    return {
        create: function(req, res) {
            var newUser = {
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                UserInfo: {
                    fullName: req.body.fullName
                }
            };
            User.findOrCreate({ where: { email: newUser.email }, defaults: newUser, include: [UserInfo] })
                .spread(function(user, created) {
                    if (created) {
                        res.send("success");
                    } else {
                        res.send("already");
                    }
                });
        },
        put: function(req, res) {
            var updateUser = {
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                UserInfo: {
                    fullName: req.body.fullName,
                    about: req.body.about,
                    profilePhoto: req.body.profilePhoto,
                    billingAddress: req.body.billingAddress
                }
            };
            User.findOne({ where: { email: updateUser.email }, include: [UserInfo] })
                .then(function(user) {
                    user.updateAttributes(updateUser)
                        .then(function(result) {
                            console.log(result);
                        });
                });
        },
        get: function(req, res) {
            User.findAll().then(function(users) {
                res.send(users);
            });
        }
    };
};
