(function() {
    'use strict';

    angular
        .module('web')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController($http, CommonInfo, $state, growl, $stateParams) {
        var vm = this;

        vm.user = {
            confirmPassword: '',
            password: ''
        };
        vm.token = "";

        vm.resetPassword = resetPassword;

        activate();

        function activate() {
        	vm.token = $stateParams.token;
        	console.log(vm.token);
        }

        function resetPassword() {
            if (vm.user.email && vm.user.password) {
                $http.post(CommonInfo.getAppUrl() + "/api/reset", vm.user).then(
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
    }
})();
