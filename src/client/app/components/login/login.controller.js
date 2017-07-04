'use strict';

angular.module('app.login')
.controller('LoginController', LoginController) ;


LoginController.$inject = ['$scope', '$state', 'AuthService'];

function LoginController($scope, $state, AuthService) {
    var vm = this;
    $scope.$parent.vm.a = 1;
    vm.login = login;

    AuthService.login(null, 2).then(
        function (res){
            $state.go('homepage');
        }
    );

    function login() {
        var request = {
            email: vm.email,
            password: vm.password
        }
        console.log(request);
        return AuthService.login(request, vm.remember == true ? 1 : 0).then(function (res) {
            toastr.success(res);
            $state.go('homepage');
        }, function (err) {
            toastr.error(err);
        });
    }
}