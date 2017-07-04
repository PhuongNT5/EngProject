angular.module('app.home')
    .config(loginConfig);

function loginConfig($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/components/home/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
};