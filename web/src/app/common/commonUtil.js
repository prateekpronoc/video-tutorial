(function() {
    'use strict';

    angular
        .module('web')
        .factory('CommonInfo', CommonInfo)
        .factory('credentials', credentials)
        .factory('Modal', Modal)
        .directive('jwplayerjs', jwplayerjs);

    /** @ngInject */
    function jwplayerjs($compile) {
        return {
            restrict: 'EC',
            scope: {
                playerId: '@',
                setupVars: '=setup'

            },
            link: function(scope, element, attrs) {
                var id = scope.playerId || 'random_player_' + Math.floor((Math.random() * 999999999) + 1),
                    getTemplate = function(playerId) {
                        return '<div id="' + playerId + '"></div>';
                    };

                element.html(getTemplate(id));
                $compile(element.contents())(scope);
                jwplayer(id).setup(scope.setupVars);
            }
        };
    }

    /** @ngInject */
    function CommonInfo($localStorage, $state) {
        return {
            getInfoObj: function() {
                return angular.copy($localStorage.infoObj);
            },
            getInfo: function(item) {
                if (!$localStorage.infoObj || !$localStorage.infoObj.user)
                    $state.go('login');
                else
                    return angular.copy($localStorage.infoObj[item]);
            },
            setInfo: function(item, value) {
                var obj = $localStorage.infoObj || {};
                obj[item] = angular.copy(value);
                $localStorage.infoObj = obj;
            },
            reset: function() {
                $localStorage.$reset();
            },
            getAppUrl: function() {
                return 'http://52.66.77.5';
            }
        };
    }

    /** @ngInject */
    function credentials(CommonInfo) {
        return {
            getCredentials: function() {
                if(CommonInfo.getInfo('user'))
                    var userType = CommonInfo.getInfo('user').profileType;
                var config = {};
                switch (userType) {
                    case 'admin':
                        config = {
                            tabs: {
                                library: false,
                                allCourses: true,
                                myCourses: false,
                                allLessons: true,
                                instructor: true,
                                students: true
                            },
                            createCourse: true,
                            createLesson: true
                        };
                        break;
                    case 'student':
                        config = {
                            tabs: {
                                library: true,
                                allCourses: false,
                                myCourses: true,
                                allLessons: false,
                                instructor: false,
                                students: false
                            },
                            createCourse: false,
                            createLesson: false
                        };
                        break;
                };
                return config;
            }
        };
    }

    /** @ngInject */
    function Modal($uibModal) {
        return {
            openModal: function(templateUrl) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: templateUrl,
                    bindToController: true,
                    controllerAs: 'vm'
                });

                modalInstance.result.then(function(selectedItem) {

                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
        };
    }
})();
