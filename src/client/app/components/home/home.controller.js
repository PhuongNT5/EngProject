angular.module('app.home')
    .controller('HomeController', ['$state', 'AuthService', HomeController]);

function HomeController($state, AuthService) {
    var vm = this;

    vm.logout = function () {
        toastr.success(AuthService.logout());
        $state.go('auth.login');
    }
}