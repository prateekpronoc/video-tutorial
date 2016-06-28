(function() {
    'use strict';

    angular
        .module('web')
        .factory('CommonInfo', CommonInfo)
        .factory('credentials', credentials)
        .factory('Modal', Modal);

    /** @ngInject */
    function CommonInfo($localStorage) {
        return {
            getInfoObj: function() {
                return $localStorage.infoObj;
            },
            getInfo: function(item) {
                return $localStorage.infoObj[item];
            },
            setInfo: function(item, value) {
                var obj = $localStorage.infoObj || {};
                obj[item] = value;
                $localStorage.infoObj = obj;
            }
        };
    }

    /** @ngInject */
    function credentials(CommonInfo) {
        return {
            getCredentials: function() {
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
                    templateUrl: templateUrl
                });

                modalInstance.result.then(function(selectedItem) {

                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
        };
    }
})();
