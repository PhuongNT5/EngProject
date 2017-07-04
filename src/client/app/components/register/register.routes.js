angular.module('app.register').config(registerConfig);
function registerConfig($stateProvider){
 $stateProvider
        .state('register', {
            url: '/register',
            templateUrl: 'app/components/register/register.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })
};