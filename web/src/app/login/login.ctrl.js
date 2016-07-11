(function() {
    'use strict';

    angular
        .module('web')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($http, $state, CommonInfo, growl) {
        var vm = this;

        vm.user = {
            email: '',
            password: ''
        };
        vm.newUser = {
            fullName: '',
            email: '',
            password: '',
            phone: '',
        };

        vm.login = login;
        vm.signup = signup;

        activate();

        function activate() {

        }

        function login() {
            if (vm.user.email && vm.user.password) {
                $http.post(CommonInfo.getAppUrl() + "/api/login", vm.user).then(
                    function(response) {
                        if (response && response.data && response.data.result && !response.data.Error) {
                            CommonInfo.setInfo('user', response.data.result);
                            var profileType = response.data.result.profileType;
                            if (profileType == 'student')
                                $state.go('main.libary');
                            else if (profileType == 'admin')
                                $state.go('main.courses');
                        } else if(response && response.data && response.data.Error) {
                            growl.info(response.data.Message);
                        }
                    },
                    function(response) {
                        growl.info(response.data.Message);
                    }
                );
            }
        };

        function signup() {
            if (vm.newUser.email && vm.newUser.phone && vm.newUser.fullName) {
                vm.newUser.profileType = 'student';
                $http.post(CommonInfo.getAppUrl() + "/api/user", vm.newUser).then(
                    function(response) {
                        if (response && response.data && !response.data.Error) {
                            growl.success('Signup successfuly');
                            vm.newUser = {};
                            vm.activeForm = 0;
                        } else if(response && response.data && response.data.Error){
                            growl.info(response.data.Message);
                        }
                    },
                    function(response) {
                        growl.info('Unable to signup, try after some time');
                    }
                );
            }
        };
    }
})();
