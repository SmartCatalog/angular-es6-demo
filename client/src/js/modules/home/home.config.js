function HomeConfig($stateProvider) {
    "use strict";
    'ngInject';

    $stateProvider
        .state('app.home',  {
            url: '/',
            controller: 'HomeCtrl as $ctrl',
            templateurl: 'modules/home/home.html',
            title: 'Home'
        })
        .state('app.denied', {
            url: '/access-denied',
            templateurl: 'modules/home/access-denied.html'
        });
}

export default HomeConfig