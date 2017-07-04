angular.module('app.login')
    .config(homeConfig);

function homeConfig($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/components/login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
};