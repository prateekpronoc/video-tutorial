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
    function MainController($http, CommonInfo, Upload, $state, credentials, Modal) {
        var vm = this;

        vm.userInfo;
        vm.isCollapsed = true;
        vm.lesson = {};
        vm.config = {};
        vm.courses = [];
        vm.units = [];
        vm.lessons = [];

        vm.getAllCourses = getAllCourses;
        vm.getMyCourses = getMyCourses;
        vm.getUnits = getUnits;
        vm.getAllLessons = getAllLessons;
        vm.getLessons = getLessons;
        vm.getUsers = getUsers;
        vm.profileImgUpload = profileImgUpload;
        vm.updateProfile = updateProfile;
        vm.showCourseDemo = showCourseDemo;
        //vm.closeModal = closeModal;

        activate();

        function activate() {
            vm.config = credentials.getCredentials();
            vm.userInfo = CommonInfo.getInfo('user');
            getUserInfo();
            if (vm.config.tabs.library) {
                if ($state.is('main.libary')) {
                    getAllCourses();
                } else if ($state.is('main.myCourses')) {
                    getMyCourses();
                }
            } else {
                if ($state.is('main.courses')) {
                    getAllCourses();
                }
            }
        }

        function getUserInfo() {
            $http.get('/api/user/' + vm.userInfo.userId).then(function(response) {
                if (response && response.data) {
                    vm.userInfo = response.data.Profile;
                    CommonInfo.setInfo('user', vm.userInfo);
                }
            }, function(response) {});
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
                userId: vm.userInfo.userId
            };
            $http.post('/api/course/subscribed', data).then(function(response) {
                if (response && response.data) {
                    vm.courses = response.data.courses;
                }
            }, function(response) {});
        }

        function getUnits(courseId) {
            var data = {
                courseId: courseId
            };
            $http.post('/api/unit/byCourse', data).then(function(response) {
                if (response && response.data) {
                    vm.units = response.data.units;
                    for (var i = 0; i < vm.units.length; i++) {
                        vm.units[i].lessonsList = vm.units[i].lessons.split(',');
                    }
                    console.log(vm.units)
                }
            }, function(response) {

            });
        }

        function getAllLessons(){
            $http.get('/api/lesson/all').then(function(response) {
                if (response && response.data) {
                    vm.lessons = response.data.lessons;
                }
            }, function(response) {});
        }

        function getLessons(unitId) {
            var data = {
                unitId: unitId
            };
            $http.post('/api/lesson/byUnit', data).then(function(response) {
                if (response && response.data) {
                    vm.lessons = response.data.lessons;
                    vm.lesson = vm.lessons[0];
                }
            }, function(response) {});
        }

        function getUsers(type){
            var data = {
                type: type
            };
            $http.post('/api/user/byType', data).then(function(response){
                if(response && response.data && response.data.users){
                    vm.users = response.data.users;
                }
            }, function(response){});
        }

        function updateProfile() {
            console.log(123)
            if (vm.userInfo) {
                $http.put('/api/user', vm.userInfo).then(function(response) {
                    if (response && response.data && !response.data.Error) {
                        console.log(response.data);
                    }
                }, function(response) {});
            }
        }

        function profileImgUpload(file) {
            console.log(vm.profileImg);
            Upload.http({
                url: '/api/user/upload',
                headers: {
                    'Content-Type': file.type
                },
                data: { files: file }
            }).then(function(resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            }, function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        }

        function showCourseDemo(courseId) {
            Modal.openModal('app/partical/showDemo.html');
        }

        // function closeModal(){
        //     $uibModalInstance.dismiss('cancel');
        // }
    }
})();
