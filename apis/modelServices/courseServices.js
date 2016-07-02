var md5 = require('MD5');

module.exports = function(sequelize) {
    var courseModel = require("../model/course.js")(sequelize);
    var userModel = require("../model/user.js")(sequelize);
    var Course = courseModel.Course;
    var User = userModel.User;
    var subscriber = Course.belongsToMany(User, { as: 'subscriber', through: 'subscribers' });
    var instructor = User.belongsToMany(Course, { as: 'instructor', through: 'instructors' });
    return {
        post: function(req, res) {
            var newCourse = {
                courseName: req.body.courseName,
                courseDescription: req.body.description,
                instructor: [
                    { id: 1 }
                ]
            };
            Course.findOrCreate({ where: { courseName: newCourse.courseName }, defaults: newCourse, include: [{ model: instructor, as: 'instructor' }] })
                .spread(function(user, created) {
                    if (created) {
                        res.json({ "Error": false, "Message": "User Created" });
                    } else {
                        res.json({ "Error": true, "Message": "User Already Present" });
                    }
                });
        }
    };
};
