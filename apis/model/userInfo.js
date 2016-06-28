var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    var UserInfo = sequelize.define("UserInfo", {
        fullName: Sequelize.STRING,
        about: Sequelize.STRING,
        profilePhoto: Sequelize.STRING,
        billingAddress: Sequelize.STRING
    });
    return {
        UserInfo: UserInfo
    };
};
