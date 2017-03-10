function Config($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider, AppConstants) {
    "use strict";
    'ngInject';

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.interceptors.push('TokenInterceptor');

    localStorageServiceProvider.setPrefix(AppConstants.localStoragePrefix);

    $stateProvider.state('app', {
        abstract: true,
        templateUrl: 'modules/layout/app-view.html'
    });

    $urlRouterProvider.otherwise('/');

}

export default Config;