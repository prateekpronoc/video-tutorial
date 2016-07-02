var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    var User = sequelize.define("User", {
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        password: Sequelize.STRING,
        fullName: Sequelize.STRING,
        about: Sequelize.STRING,
        profilePhoto: Sequelize.STRING,
        billingAddress: Sequelize.STRING,
        profileType: Sequelize.STRING,
        status: Sequelize.STRING
    });
    return {
        User: User
    };
};
