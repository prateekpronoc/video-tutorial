var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    var Course = sequelize.define("Course", {
        courseName: Sequelize.STRING,
        courseDescription: Sequelize.STRING,
        courseDuration: Sequelize.STRING,
        courseDemo: Sequelize.STRING,
        courseValidFrom: Sequelize.STRING,
        courseValidTill: Sequelize.STRING
    });
    return {
        Course: Course
    };
};
