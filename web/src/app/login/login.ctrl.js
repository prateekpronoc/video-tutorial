(function() {
    'use strict';

    angular
        .module('web')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($http, $state, CommonInfo) {
        var vm = this;

        vm.user = {
            email: '',
            password: ''
        };
        vm.newUser = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            about: '',
        };

        vm.login = login;
        vm.signup = signup;

        activate();

        function activate() {

        }

        function login() {
            if (vm.user.email && vm.user.password) {
                $http.post("/api/login", vm.user).then(
                    function(response) {
                        if (response && response.data && response.data.user) {
                            CommonInfo.setInfo('user', { 'userId': response.data.user, 'profileType': response.data.profileType });
                            if(response.data.profileType == 'student')
                                $state.go('main.libary');
                            else if(response.data.profileType == 'admin')
                                $state.go('main.courses');
                        }
                    },
                    function(response) {
                        console.log(response.data);
                    }
                );
            }
        };

        function signup() {
            if (vm.newUser.email && vm.newUser.email && vm.newUser.firstName) {
                $http.post("api/user", vm.newUser).then(
                    function(response) {
                        console.log(response.data);
                    },
                    function(response) {
                        console.log(response.data);
                    }
                );
            }
        };
    }
})();
