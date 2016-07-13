(function() {
    'use strict';

    angular
        .module('web')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($http, $state, CommonInfo, growl, $location) {
        var vm = this;
        var codeStr="";

        vm.forget = {
            status: false,
            email: ''
        };
        vm.user = {
            userName: '',
            password: ''
        };
        vm.newUser = {
            fullName: '',
            email: '',
            password: '',
            phone: '',
        };
        vm.isOtp = false;
        vm.isOtpSend = false;
        vm.isOtpValid = false;

        vm.login = login;
        vm.signup = signup;
        vm.forgetPassword = forgetPassword;
        vm.requestOtp = requestOtp;
        vm.validateOtp = validateOtp;

        activate();

        function activate() {

        }

        function login() {
            if (vm.user.userName && vm.user.password) {
                $http.post(CommonInfo.getAppUrl() + "/api/login", vm.user).then(
                    function(response) {
                        if (response && response.data && response.data.result && !response.data.Error) {
                            CommonInfo.setInfo('user', response.data.result);
                            var profileType = response.data.result.profileType;
                            if (profileType == 'student')
                                $state.go('main.libary');
                            else if (profileType == 'admin')
                                $state.go('main.courses');
                        } else if (response && response.data && response.data.Error) {
                            growl.info(response.data.Message);
                        }
                    },
                    function(response) {
                        growl.info(response.data.Message);
                    }
                );
            }
        }

        function signup() {
            if (vm.newUser.email && vm.newUser.phone && vm.newUser.fullName) {
                vm.newUser.profileType = 'student';
                $http.post(CommonInfo.getAppUrl() + "/api/user", vm.newUser).then(
                    function(response) {
                        if (response && response.data && !response.data.Error) {
                            growl.success('Signup successfuly');
                            vm.user.userName = vm.newUser.phone;
                            vm.forget = {
                                status: false
                            };
                            vm.newUser = {};
                            vm.activeForm = 0;
                        } else if (response && response.data && response.data.Code) {
                            if (response.data.isEmail) {
                                growl.info('Sorry it looks like ' + vm.newUser.email + ' belongs to an existing account. Please login using this email address');
                                vm.user.userName = vm.newUser.email;
                            } else if (response.data.isPhone) {
                                growl.info('Sorry it looks like ' + vm.newUser.phone + ' belongs to an existing account. Please login using this phone number');
                                vm.user.userName = vm.newUser.phone;
                            }
                            vm.forget = {
                                status: false
                            };
                            vm.newUser = {};
                            vm.activeForm = 0;

                        } else if (response && response.data && response.data.Error) {
                            growl.info(response.data.Message);
                        }
                    },
                    function(response) {
                        growl.info('Unable to signup, try after some time');
                    }
                );
            }
        }

        function forgetPassword() {
            if ($location.absUrl()) {
                var url = $location.absUrl();
                url = url.substring(0, url.indexOf('#') + 2) + 'reset/';
                vm.forget.host = url;
                $http.post(CommonInfo.getAppUrl() + "/api/forget", vm.forget).then(
                    function(response) {
                        if (response && response.data && !response.data.Error) {
                            growl.success('mail send');
                        } else if (response && response.data && response.data.Error) {
                            growl.info(response.data.Message);
                        }
                    },
                    function(response) {
                        growl.info('Mail not send, try after some time');
                    }
                );
            }
        }

        function requestOtp(){
            if (vm.newUser.phone) {
                $http.post(CommonInfo.getAppUrl() + "/api/sendOtp", vm.newUser).then(
                    function(response) {
                        if (response && response.data.secret) {
                            codeStr = response.data.secret;
                            vm.isOtpSend = true;
                        } else {
                            growl.info('Some error occured, try after some time');
                        }
                    },
                    function(response) {
                        growl.info(response.data.Message);
                    }
                );
            }
        }

        function validateOtp(){
            if (vm.newUser.otp && codeStr) {
                var data = {
                    code: vm.newUser.otp,
                    secret: codeStr
                }
                $http.post(CommonInfo.getAppUrl() + "/api/validateOtp", data).then(
                    function(response) {
                        if (response && !response.data.Error) {
                            vm.isOtpValid = true;
                        } else {
                            growl.info('You have entered incorrect pin');
                        }
                    },
                    function(response) {
                        growl.info(response.data.Message);
                    }
                );
            }
        }
    }
})();
