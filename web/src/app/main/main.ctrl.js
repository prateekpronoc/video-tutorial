(function() {
    'use strict';

    angular
        .module('web')
        .controller('MainController', MainController)
        .directive('youtube', youtube);

    /** @ngInject */
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
        vm.categoryPopup = false;
        vm.categories = []; // list of categories in create/edit course page
        vm.lessons = []; // list of all lessons in admin role
        vm.lessonComments = []; //list of comments by lesson id
        vm.users = []; // list of (instructor, student) users in admin role
        vm.user = {};
        vm.course = { // object used while (create/edit) course
            units: [],
            instructors: []
        };
        vm.objMode; // hold the current mode for entity(edit/insert)

        vm.getAllCourses = getAllCourses;
        vm.subscribeCourse = subscribeCourse;
        vm.getMyCourses = getMyCourses;
        vm.selectCourse = selectCourse;
        vm.searchCourse = searchCourse;
        vm.selectLesson = selectLesson;
        vm.commentOnLesson = commentOnLesson;
        vm.updateProfile = updateProfile;
        vm.showCourseDemo = showCourseDemo;
        vm.showCourseInfo = showCourseInfo;
        vm.downloadFile = downloadFile;
        vm.signout = signout;
        //for admin side
        vm.addCategory = addCategory;
        vm.getCourseById = getCourseById;
        vm.editCourse = editCourse;
        vm.addUnitToCourse = addUnitToCourse;
        vm.addUserToCourse = addUserToCourse;
        vm.updateCourse = updateCourse;
        vm.deleteCourse = deleteCourse;
        vm.getAllLessons = getAllLessons;
        vm.getLessonById = getLessonById;
        vm.editLesson = editLesson;
        vm.changeCourse = changeCourse;
        vm.addFilesToLesson = addFilesToLesson;
        vm.updateLesson = updateLesson;
        vm.deleteLesson = deleteLesson;
        vm.getLessonComments = getLessonComments;
        vm.getUsers = getUsers;
        vm.approveUser = approveUser;
        vm.getUserById = getUserById;
        vm.editUser = editUser;


        activate();

        function activate() {
            vm.config = credentials.getCredentials();
            vm.userInfo = CommonInfo.getInfo('user');
            if (vm.userInfo && vm.userInfo.profileType == 'student') {
                if ($state.is('main.libary')) {
                    getAllCourses();
                } else if ($state.is('main.myCourses')) {
                    getMyCourses();
                } else if ($state.is('main.myLessons')) {
                    var course = CommonInfo.getInfo('course');
                    getUnits(course.id);
                }
            } else if (vm.userInfo && vm.userInfo.profileType == 'admin') {
                if ($state.is('main.courses')) {
                    getAllCourses();
                    showCategoryModal();
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
                } else if ($state.is('main.comments')) {
                    var lesson = CommonInfo.getInfo('lesson');
                    if (lesson && lesson.id)
                        showLessonComments(lesson.id);
                }
            }
        }

        function getAllCourses() {
            $http.get(CommonInfo.getAppUrl() + '/api/course/all').then(function(response) {
                if (response && response.data) {
                    vm.courses = response.data.courses;
                }
            }, function(response) {});
        }

        function searchCourse() {
            if (vm.searchText) {
                var data = {
                    name: vm.searchText
                }
                $http.post(CommonInfo.getAppUrl() + '/api/course/search', data).then(function(response) {
                    if (response && response.data) {
                        $state.go('main.libary');
                        vm.courses = response.data.courses;
                    }
                }, function(response) {});
            }
        }

        function subscribeCourse(course) {
            if (course) {
                var data = {
                    phone: vm.userInfo.phone,
                    fullName: vm.userInfo.fullName,
                    email: vm.userInfo.email,
                    purpose: 'Subscription: ' + vm.userInfo.fullName + ' for ' + course.name,
                    amt: course.subscriptionFee,
                    userId: vm.userInfo.id,
                    courseId: course.id
                };
                $http.post(CommonInfo.getAppUrl() + '/api/course/subscribe', data).then(function(response) {
                    if (response && response.data) {
                        window.open(response.data.url + '?embed=form');
                    }
                }, function(response) {});
            }
        }

        function getMyCourses() {
            var data = {
                userId: vm.userInfo.id
            };
            $http.post(CommonInfo.getAppUrl() + '/api/course/subscribed', data).then(function(response) {
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
                $http.post(CommonInfo.getAppUrl() + '/api/unit/byCourse', data).then(function(response) {
                    if (response && response.data) {
                        vm.units = response.data.units;
                        selectLesson(vm.units[0].lessons[0]);
                        if (navigateToPage)
                            $state.go('main.myLessons');
                    }
                }, function(response) {

                });
            }
        }

        function selectLesson(lesson) {
            vm.lesson = lesson
            if (lesson.video) {
                vm.lesson.options = {
                    file: lesson.video,
                    image: lesson.poster,
                    type: 'hls',
                    androidhls: 'true',
                    width: '100%',
                    player: 'html5',
                    aspectratio: '16:9'
                }
            } else {
                vm.lesson.options = null;
            }
        }

        function getAllLessons() {
            $http.get(CommonInfo.getAppUrl() + '/api/lesson/all').then(function(response) {
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
                timestamp: 'Just now',
                commentedBy: {
                    profilePhoto: vm.userInfo.profilePhoto,
                    fullName: vm.userInfo.fullName
                }
            };
            if ($state.is('main.comments')) {
                vm.lessonComments.push(newComment);
            } else {
                vm.lesson.comments.push(newComment);
            }
            $http.post(CommonInfo.getAppUrl() + '/api/lesson/addComment', data).then(function(response) {
                if (response && response.data && !response.data.Error) {
                    growl.success('Comment send');
                    vm.commentMsg = "";
                }
            }, function(response) {

            });
        }

        function getCourseById(courseId) {
            $http.post(CommonInfo.getAppUrl() + '/api/course/byId', { 'courseId': courseId }).then(function(response) {
                if (response && response.data && response.data.course) {
                    CommonInfo.setInfo('course', response.data.course);
                    editCourse('edit', response.data.course);
                }
            }, function(response) {});
        }

        function editCourse(mode, course) {
            $http.get(CommonInfo.getAppUrl() + '/api/category/all').then(function(response) {
                if (response && response.data && response.data.categories) {
                    vm.categories = response.data.categories;
                }
            }, function(response) {});
            $http.post(CommonInfo.getAppUrl() + '/api/user/byType', { 'type': 'instructor' }).then(function(response) {
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
            var selectedInstructor = {
                fullName: vm.course.courseUser.fullName,
                userId: vm.course.courseUser.id
            };
            if (!_.find(vm.course.instructors, { 'userId': vm.course.courseUser.id }))
                vm.course.instructors.push(selectedInstructor);
            vm.course.courseUser = '';
        }

        function updateCourse(files) {
            Upload.upload({
                url: CommonInfo.getAppUrl() + '/api/course',
                data: { file: files, course: vm.course },
                method: 'POST'
            }).then(function(response) {
                response = response.data;
                if (response && !response.Error) {
                    growl.success('Course Updated successfully');
                }
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            });
        }

        function deleteCourse(course) {
            if (course && confirm('Are you sure you want to delete ' + course.name)) {
                var data = {
                    course: course
                };
                data.course.isDeleted = true;
                $http.post(CommonInfo.getAppUrl() + '/api/course', data).then(function(response) {
                    if (response && response.data && !response.data.Error) {
                        growl.success('Course deleted successfully');
                    }
                }, function(response) {});
            }
        }

        function getLessonById(lessonId) {
            $http.post(CommonInfo.getAppUrl() + '/api/lesson/byId', { 'lessonId': lessonId }).then(function(response) {
                if (response && response.data && response.data.lesson) {
                    CommonInfo.setInfo('lesson', response.data.lesson);
                    editLesson('edit', response.data.lesson);
                }
            }, function(response) {});
        }

        function editLesson(mode, lesson) {
            vm.objMode = mode;
            vm.lesson = lesson || { courses: [] };
            vm.lesson.newFiles = [];
            $http.get(CommonInfo.getAppUrl() + '/api/course/courseAndUnits').then(function(response) {
                if (response && response.data && response.data.courses) {
                    vm.courseUnitList = response.data.courses;
                    changeCourse();
                }
            }, function(response) {});


            if (mode == 'edit') {
                $state.go('main.editLesson');
            } else if (mode == 'insert') {
                $state.go('main.createLesson');
            }
        }

        function changeCourse() {
            if (vm.lesson && vm.lesson.courses && vm.lesson.courses.length > 0) {
                vm.lesson.unitList = _.find(vm.courseUnitList, { 'id': vm.lesson.courses[0].courseId }).units;
            }
        }

        function addFilesToLesson() {
            if (vm.lesson.file) {
                vm.lesson.newFiles = _.uniqBy(vm.lesson.newFiles.concat(vm.lesson.file), 'name');
            }
        }

        function updateLesson(files) {
            Upload.upload({
                url: CommonInfo.getAppUrl() + '/api/lesson',
                data: { file: files, lesson: vm.lesson },
                method: 'POST'
            }).then(function(response) {
                response = response.data;
                if (response && !response.Error) {
                    growl.success('Lesson Updated successfully');
                }
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            });
        }

        function deleteLesson(lesson) {
            if (lesson && confirm('Are you sure you want to delete ' + lesson.name)) {
                var data = {
                    lesson: lesson
                };
                data.lesson.isDeleted = true
                $http.post(CommonInfo.getAppUrl() + '/api/lesson', data).then(function(response) {
                    if (response && response.data && !response.data.Error) {
                        growl.success('Lesson deleted successfully');
                    }
                }, function(response) {});
            }
        }

        function getLessonComments(lesson) {
            CommonInfo.setInfo('lesson', lesson);
            showLessonComments(lesson.id);
        }

        function showLessonComments(lessonId) {
            if (lessonId) {
                vm.lesson.id = lessonId
                var data = {
                    lessonId: lessonId
                }
                $http.post(CommonInfo.getAppUrl() + '/api/lesson/allComment', data).then(function(response) {
                    if (response && response.data && !response.data.Error) {
                        vm.lessonComments = response.data.comments;
                        if (vm.lessonComments && vm.lessonComments.length > 0)
                            $state.go('main.comments');
                        else
                            growl.info('No comments found.')
                    }
                }, function(response) {});
            }
        }

        function getUsers(type) {
            var data = {
                type: type
            };
            $http.post(CommonInfo.getAppUrl() + '/api/user/byType', data).then(function(response) {
                if (response && response.data && response.data.users) {
                    vm.users = response.data.users;
                }
            }, function(response) {});
        }

        function approveUser(user) {
            var userInfo = angular.copy(user);
            userInfo.status = 'active';
            $http.put(CommonInfo.getAppUrl() + '/api/user', userInfo).then(function(response) {
                if (response && response.data && !response.data.Error) {
                    user.status = 'active';
                }
            }, function(response) {});
        }

        function getUserById(userId) {
            $http.post(CommonInfo.getAppUrl() + '/api/user/byId', { userId: userId }).then(function(response) {
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
                    url: CommonInfo.getAppUrl() + '/api/user',
                    data: { file: files, user: vm.user },
                    method: 'PUT'
                }).then(function(response) {
                    response = response.data;
                    if (response && !response.Error) {
                        growl.success('Profile updated successfully');
                        if (vm.objMode == 'update') {
                            vm.userInfo = response.user;
                            CommonInfo.setInfo('user', vm.userInfo);
                        }
                    }
                }, function(resp) {
                    console.log('Error status: ' + resp.status);
                });
            }
        }

        function signout() {
            CommonInfo.reset();
            $state.go('login');
        }

        function showCourseDemo(course) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/partical/showDemo.html',
                size: 'lg',
                controller: function($scope, item) {
                    $scope.options = {
                        file: item.demoVideo,
                        image: item.demoPoster,
                        type: 'hls',
                        androidhls: 'true',
                        width: '100%',
                        player: 'html5',
                        aspectratio: '16:9'
                    };
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
                $http.post(CommonInfo.getAppUrl() + '/api/unit/byCourse', data).then(function(response) {
                    if (response && response.data && response.data.units && response.data.units.length > 0) {
                        var item = {
                            courseName: courseName,
                            units: response.data.units
                        };
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
                    } else {
                        growl.info('No information for this course yet added');
                    }
                }, function(response) {

                });
            }
        }

        function downloadFile(filePath, fileName) {
            var data = {
                fileName: fileName,
                filePath: filePath,
                userId: vm.userInfo.id
            };
            $http.post(CommonInfo.getAppUrl() + '/api/util/downloadFile', data).then(function(response) {
                console.log(response);
            }, function(response) {});
        }

        function showCategoryModal() {
            vm.categories = [];
            $http.get(CommonInfo.getAppUrl() + '/api/category/all').then(function(response) {
                if (response && response.data.categories && response.data.categories.length > 0) {
                    vm.categories = response.data.categories;
                }
            });
        }

        function addCategory() {
            console.log(vm.newCategory);
            $http.post(CommonInfo.getAppUrl() + '/api/category', vm.newCategory).then(function(response) {
                if (response && response.data && !response.data.Error) {
                    vm.categories.push(vm.newCategory);
                    vm.categoryPopup = false;
                    vm.newCategory = {};
                    growl.success('Category added successfully');
                }
            }, function(response) {});
        }
    }
})();
