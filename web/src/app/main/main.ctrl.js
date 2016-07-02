(function() {
    'use strict';

    angular
        .module('web')
        .controller('MainController', MainController)
        .directive('youtube', youtube);


    function youtube($sce) {
        return {
            restrict: 'EA',
            scope: { code: '=' },
            replace: true,
            template: '<div style="height:400px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
            link: function(scope) {
                scope.$watch('code', function(newVal) {
                    if (newVal) {
                        scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
                    }
                });
            }
        };
    }

    /** @ngInject */
    function MainController($http, CommonInfo, Upload, $state, credentials, $uibModal, _, growl, $scope) {
        var vm = this;

        vm.userInfo; // hold user info[both]
        vm.isCollapsed = true; // for the drop down main menu[both]
        vm.lesson = {}; // current lesson on (my, edit, add) lesson page[both]
        vm.config = {}; // user configuration for showing tabs[both]
        vm.courses = []; // list of (Library, my, all) courses[both]
        vm.units = []; // list of units, lessons to show on my lessons page[student]
        //for admin side only
        vm.categories = []; // list of categories in create/edit course page
        vm.lessons = []; // list of all lessons in admin role
        vm.users = []; // list of (instructor, student) users in admin role
        vm.user = {};
        vm.course = { // object used while (create/edit) course
            units: [],
            instructors: []
        };
        vm.objMode; // hold the current mode for entity(edit/insert)

        vm.getAllCourses = getAllCourses;
        vm.getMyCourses = getMyCourses;
        vm.selectCourse = selectCourse;
        vm.commentOnLesson = commentOnLesson;
        vm.profileImgUpload = profileImgUpload;
        vm.updateProfile = updateProfile;
        vm.showCourseDemo = showCourseDemo;
        vm.showCourseInfo = showCourseInfo;
        vm.signout = signout;
        //for admin side
        vm.getCourseById = getCourseById;
        vm.editCourse = editCourse;
        vm.addUnitToCourse = addUnitToCourse;
        vm.addUserToCourse = addUserToCourse;
        vm.getLessonById = getLessonById;
        vm.editLesson = editLesson;
        vm.getAllLessons = getAllLessons;
        vm.getUsers = getUsers;
        vm.approveUser = approveUser;
        vm.getUserById = getUserById;
        vm.editUser = editUser;


        activate();

        function activate() {
            vm.config = credentials.getCredentials();
            vm.userInfo = CommonInfo.getInfo('user');
            if (vm.config.tabs.library) {
                if ($state.is('main.libary')) {
                    getAllCourses();
                } else if ($state.is('main.myCourses')) {
                    getMyCourses();
                } else if ($state.is('main.myLessons')) {
                    var course = CommonInfo.getInfo('course');
                    getUnits(course.id);
                }
            } else {
                if ($state.is('main.courses')) {
                    getAllCourses();
                } else if ($state.is('main.lessons')) {
                    getAllLessons();
                } else if ($state.is('main.instructors')) {
                    getUsers('instructor');
                } else if ($state.is('main.students')) {
                    getUsers('student');
                } else if ($state.is('main.createCourse')) {
                    editCourse('insert');
                } else if ($state.is('main.editCourse')) {
                    var course = CommonInfo.getInfo('course');
                    if (course && course.id)
                        editCourse('edit', course);
                } else if ($state.is('main.createLesson')) {
                    editLesson('insert');
                } else if ($state.is('main.editLesson')) {
                    var lesson = CommonInfo.getInfo('lesson');
                    if (lesson && lesson.id)
                        editLesson('edit', lesson);
                } else if ($state.is('main.createUser')) {
                    editUser('insert');
                } else if ($state.is('main.editUser')) {
                    var user = CommonInfo.getInfo('editUser');
                    if (user && user.id)
                        editUser('edit', user);
                }
            }
        }

        function getAllCourses() {
            $http.get('/api/course/all').then(function(response) {
                if (response && response.data) {
                    vm.courses = response.data.courses;
                }
            }, function(response) {});
        }

        function getMyCourses() {
            var data = {
                userId: vm.userInfo.id
            };
            $http.post('/api/course/subscribed', data).then(function(response) {
                if (response && response.data) {
                    vm.courses = response.data.courses;
                }
            }, function(response) {});
        }

        function selectCourse(course) {
            if (course) {
                CommonInfo.setInfo('course', course);
                getUnits(course.id, true);
            }
        }

        function getUnits(courseId, navigateToPage) {
            if (courseId) {
                var data = {
                    courseId: courseId
                };
                $http.post('/api/unit/byCourse', data).then(function(response) {
                    if (response && response.data) {
                        vm.units = response.data.units;
                        vm.lesson = vm.units[0].lessons[0];
                        if (navigateToPage)
                            $state.go('main.myLessons');
                    }
                }, function(response) {

                });
            }
        }

        function getAllLessons() {
            $http.get('/api/lesson/all').then(function(response) {
                if (response && response.data) {
                    vm.lessons = response.data.lessons;
                }
            }, function(response) {});
        }

        function commentOnLesson() {
            var data = {
                lessonId: vm.lesson.id,
                comment: vm.commentMsg,
                userId: vm.userInfo.id
            };
            var newComment = {
                comments: vm.commentMsg,
                user: vm.userInfo.fullName,
                timestamp: 'Just now'
            };
            vm.lesson.comments.push(newComment);
            $http.post('/api/lesson/addComment', data).then(function(response) {
                if (response && response.data) {
                    console.log(response.data)
                }
            }, function(response) {

            });
        }

        function getCourseById(courseId) {
            $http.post('/api/course/byId', { 'courseId': courseId }).then(function(response) {
                if (response && response.data && response.data.course) {
                    CommonInfo.setInfo('course', response.data.course);
                    editCourse('edit', response.data.course);
                }
            }, function(response) {});
        }

        function editCourse(mode, course) {
            $http.get('/api/category/all').then(function(response) {
                if (response && response.data && response.data.categories) {
                    vm.categories = response.data.categories;
                }
            }, function(response) {});
            $http.post('/api/user/byType', { 'type': 'instructor' }).then(function(response) {
                if (response && response.data && response.data.users) {
                    vm.users = response.data.users;
                }
            }, function(response) {});
            vm.objMode = mode;
            if (mode == 'edit') {
                $state.go('main.editCourse');
                vm.course = course;
            } else if (mode == 'insert') {
                vm.course = {
                    units: [],
                    instructors: []
                };
                $state.go('main.createCourse');
            }
        }

        function addUnitToCourse() {
            var values = _.compact(vm.course.courseUnit.split(','));
            _.forEach(values, function(value, key) {
                vm.course.units.push({ 'name': value });
            });
            vm.course.courseUnit = '';
        }

        function addUserToCourse() {
            if (_.findIndex(vm.course.instructors, vm.course.courseUser) == -1)
                vm.course.instructors.push(vm.course.courseUser);
            vm.course.courseUser = '';
        }

        function getLessonById(lessonId) {
            $http.post('/api/lesson/byId', { 'lessonId': lessonId }).then(function(response) {
                if (response && response.data && response.data.lesson) {
                    CommonInfo.setInfo('lesson', response.data.lesson);
                    editLesson('edit', response.data.lesson);
                }
            }, function(response) {});
        }

        function editLesson(mode, lesson) {
            $http.get('/api/course/courseAndUnits').then(function(response) {
                if (response && response.data && response.data.courses) {
                    vm.courseUnitList = response.data.courses;
                }
            }, function(response) {});
            vm.objMode = mode;
            if (mode == 'edit') {
                $state.go('main.editLesson');
                vm.lesson = lesson;
            } else if (mode == 'insert') {
                vm.lesson = {};
                $state.go('main.createLesson');
            }
        }

        // function getLessons(unitId) {
        //     var data = {
        //         unitId: unitId
        //     };
        //     $http.post('/api/lesson/byUnit', data).then(function(response) {
        //         if (response && response.data) {
        //             vm.lessons = response.data.lessons;
        //             vm.lesson = vm.lessons[0];
        //         }
        //     }, function(response) {});
        // }

        function getUsers(type) {
            var data = {
                type: type
            };
            $http.post('/api/user/byType', data).then(function(response) {
                if (response && response.data && response.data.users) {
                    vm.users = response.data.users;
                }
            }, function(response) {});
        }

        function approveUser(user) {
            var userInfo = angular.copy(user);
            userInfo.status = 'active';
            $http.put('/api/user', userInfo).then(function(response) {
                if (response && response.data && !response.data.Error) {
                    user.status = 'active';
                }
            }, function(response) {});
        }

        function getUserById(userId) {
            $http.post('/api/user/byId', { userId: userId }).then(function(response) {
                if (response && response.data && response.data.user) {
                    CommonInfo.setInfo('editUser', response.data.user);
                    editUser('edit', response.data.user);
                }
            }, function(response) {});
        }

        function editUser(mode, user) {
            vm.user = angular.copy(user) || {};
            vm.objMode = mode;
            if (mode == 'edit') {
                $state.go('main.editUser');
            } else if (mode == 'insert') {
                $state.go('main.createUser');
            } else if (mode == 'update') {
                $state.go('main.profile');
            }
        }

        function updateProfile(files) {
            if (vm.user) {
                Upload.upload({
                    url: '/api/user',
                    data: { file: files, user: vm.user },
                    method: 'PUT'
                }).then(function(response) {
                    response = response.data;
                    if(response && !response.Error){
                        growl.success('Profile updated successfully');
                        if(vm.objMode == 'update'){
                            if (response.user && response.user.profilePhoto) {
                                vm.userInfo.profilePhoto = CommonInfo.getAppUrl() + response.user.profilePhoto;
                            }
                            CommonInfo.setInfo('user', vm.userInfo);
                        }
                    }
                }, function(resp) {
                    console.log('Error status: ' + resp.status);
                });
            }
        }

        function profileImgUpload(files) {
            console.log(files);
            // Upload.upload({
            //     url: '/api/upload',
            //     data: { file: file, name: 'raj' }
            // }).then(function(resp) {
            //     vm.user.profilePhoto = 'http://localhost:3000/' + resp.data.path;
            // }, function(resp) {
            //     console.log('Error status: ' + resp.status);
            // });
        }

        function signout() {
            CommonInfo.reset();
            $state.go('login');
        }

        function showCourseDemo(course) {
            //Modal.openModal('app/partical/showDemo.html');
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/partical/showDemo.html',
                controller: function($scope, item) {
                    $scope.course = item;
                },
                resolve: {
                    item: function() {
                        return course;
                    }
                }
            });
        }

        function showCourseInfo(courseId, courseName) {
            if (courseId) {
                var data = {
                    courseId: courseId
                };
                $http.post('/api/unit/byCourse', data).then(function(response) {
                    if (response && response.data && response.data.units && response.data.units.length > 0) {
                        var item = {
                            courseName: courseName,
                            units: response.data.units
                        };
                        //Modal.openModal('app/partical/showCourseInfo.html');
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'app/partical/showCourseInfo.html',
                            controller: function($scope, item) {
                                $scope.course = item;
                            },
                            resolve: {
                                item: function() {
                                    return item;
                                }
                            }
                        });
                    }
                }, function(response) {

                });
            }
        }
    }
})();
