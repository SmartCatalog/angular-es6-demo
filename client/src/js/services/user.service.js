export default class User {
    constructor(AppConstants, $resource, localStorageService, $log) {
        'ngInject';
        
        this._AppConstants = AppConstants;
        this._$resource = $resource;
        this._localStorageService = localStorageService;
        this._$log = $log;
        this.currentUser = null;
    }
    
    saveToLocalStorage(data) {
        this._localStorageService.set(this._AppConstants.tokenKey, data.token);
        this._localStorageService.set(this._AppConstants.email_key, data.email)
        this._localStorageService.set(this._AppConstants.usernameKey, data.username);
        this._localStorageService.set(this._AppConstants.firstNameKey, data.first_name);
        this._localStorageService.set(this._AppConstants.lastNameKey, data.last_name);
        this._localStorageService.set(this._AppConstants.userIdKey, data.id);
    }
    
    getUserInfo() {
        if (this._localStorageService.keys().length > 0) {
            this._$log.info('Retrieving user info from localstorage');
            this.currentUser = {
                id: this._localStorageService.get(this._AppConstants.userIdKey),
                email: this._localStorageService.get(this._AppConstants.email_key),
                first_name: this._localStorageService.get(this._AppConstants.firstNameKey),
                last_name: this._localStorageService.get(this._AppConstants.lastNameKey),
                username: this._localStorageService.get(this._AppConstants.usernameKey),
                tokentoken: this._localStorageService.get(this._AppConstants.tokenKey)
            };
            
            return true;
        }
        
        return false;
    }
    
    getUserId() {
        return this._localStorageService.get(this._AppConstants.userIdKey);
    }
    
    clearUserInfo() {
        let resourceSession = this._$resource(`${this._AppConstants.api}/user/logout`);
        let resourcePromise = resourceSession.save().$promise;
        return resourcePromise
            .then((res) => {
                this._localStorageService.clearAll();
                this.currentUser = null;
            });
    }
    
    authenticateUser(type, credentials) {
        let route = (type == 'login') ? '/login' : '/register';
        let resourceSession  = this._$resource(`{this._AppConstants.api}/user${route}`);
        return resourceSession.save(credentials).$promise;
    }
    
    setUser(user) {
        this.currentUser = user;
        this.saveToLocalStorage(user);
    }
    
}
