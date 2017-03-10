
import angular from 'angular';
import UserService from './user.service';

let serviceModule = angular.module('app.services', []);
serviceModule.service('User', UserService);

export default serviceModule;