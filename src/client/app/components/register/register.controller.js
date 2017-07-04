angular.module('app.register')
    .controller('RegisterController', ['$scope', '$state', 'AuthService', RegisterController]);

function RegisterController($scope, $state, AuthService) {
    $scope.$parent.vm.a = 2;
    var vm = this;

    vm.register = function () {
        var newUser = {
            email: vm.email,
            password: vm.password,
            username: vm.username,
        };
        console.log(newUser);
        return AuthService.register(newUser).then(
            function (res) {
                toastr.success(res);
                $state.go('auth.login');
            },
            function (err) {
                toastr.error(err);
            }
        );
    }
}