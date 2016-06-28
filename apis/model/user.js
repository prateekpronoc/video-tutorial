var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    var User = sequelize.define("User", {
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        password: Sequelize.STRING
    });
    return {
        User: User
    };
};
