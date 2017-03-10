/**
 *
 * @author Jason Johns <jason@academiccatalog.com>
 * Created on 3/9/17.
 */

import angular from 'angular';
import ngResource from 'angular-resource';
import ngSantitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import 'angular-ui-router';
import LocalStorageModule from 'angular-local-storage';
import bootstrap from 'angular-ui-bootstrap';

import constants from './config/app.constants';
import appConfig from './config/app.constants';
import './config/app.templates';

import './modules/home';

import './services';

const requires = [
    'ui.router',
    ngResource,
    ngAnimate,
    ngSantitize,
    bootstrap,
    LocalStorageModule,
    'app.services'
];

window.app = angular.module('app', requires);
angular.module('app')
    .constant('AppConstants', constants)
    .config(appConfig);


angular.bootstrap(document, ['app'], {
    strictDi: true
});