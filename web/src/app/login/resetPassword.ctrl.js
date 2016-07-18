(function() {
    'use strict';

    angular
        .module('web')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController($http, CommonInfo, $state, growl, $stateParams) {
        var vm = this;
        var token = "";

        vm.user = {
            confirmPassword: '',
            password: ''
        };

        vm.resetPassword = resetPassword;

        activate();

        function activate() {
            token = $stateParams.token;
        }

        function resetPassword() {
            if (vm.user.password && token) {
                var data = {
                    password: vm.user.password,
                    token: token
                }
                $http.post(CommonInfo.getAppUrl() + "/api/reset", data).then(
                    function(response) {
                        if (response && response.data && !response.data.Error) {
                            growl.info('Password changed successfully');
                            $state.go('login');
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
