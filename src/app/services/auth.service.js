import {config} from '../../config';
import 'app/services/models/User';
import 'app/services/session';

function authRun (auth) {
  auth.init();
}

class AuthService {
  constructor ($http, $q, $rootScope, $cookies, User, DS, session, $rootRouter) {
    Object.assign(this, {
      $http, $q, $rootScope, $cookies, User, DS, session, $rootRouter,
      request: $q.reject(`Not Initialized`),
    })
  }

  /**
  * Initialize the current user if one was already stored in the session
  * storage.
  */
  init () {
    let token = this.$cookies.get('authToken');
    if (token) {
      let userId = this.$cookies.get('userId'),
        impersonating = this.$cookies.get('impersonating'),
        cachedUser = this.session.getObj('user');
      if (impersonating && (!cachedUser || cachedUser.id !== userId)) {
        // force relogin on a new session after impersonating
        this._clearAuth();
        this.request = this.$q.reject({auth: 'Login again'});
      } else {
        this._setAuth(token, userId);
        this.setUser(
          cachedUser && cachedUser.id === userId ? cachedUser : userId
        ).catch(() => {
          this._clearAuth();
        });
      }
    } else {
      this.request = this.$q.reject({auth: 'No token'});
    }
  }

  onLogin () {
    this.session.setObj('user', this.user);
  }

  onLogout () {
    this.$rootScope.$evalAsync(() => {
      this.$rootRouter.navigate(['Login']);
    });
  }

  setUser (userId) {
    if (!userId) {
      this.request = this.$q.reject('No userId given');
      return this.request;
    }

    let deferred = this.$q.defer();
    this.request = deferred.promise.then(user => {
      this.user = user;
      this.onLogin();
      return user;
    });

    if (typeof userId === 'string') {
      this.User.find(userId).then(user => {
        deferred.resolve(user);
      }, err => {
        this._clearAuth();
        if(err.data.detail === 'Invalid token.') {
          this.$rootRouter.navigate(['Login']);
        }
        deferred.reject(err);
      });
    }
    if (typeof userId === 'object') {
      let user = this.User.inject(userId);
      deferred.resolve(user);
      user.DSRefresh();
    }

    return this.request;
  }

  /**
  * Sets the authToken in the session storage and the Authorization header.
  */
  _setAuth (authToken, userId) {
    this.$cookies.put('authToken', authToken);
    this.$cookies.put('userId', userId);
    this.$http.defaults.headers.common.Authorization = 'Token ' + authToken;
  }

  /**
  * Removes the auth token and userId from cookie storage, removes user from
  * session storage.
  */
  _clearAuth () {
    this.$cookies.remove('authToken');
    this.$cookies.remove('userId');
    this.$cookies.remove('impersonating');
    this.session.removeItem('user');
    delete this.$http.defaults.headers.common.Authorization;
  }

  /**
  * Sends a request to login the user. If the request was successful the
  * auth token is saved to cookies and the Authorization
  * header is set. If the request failed the auth token and Authorization
  * header will be deleted.
  */
  login (username, password) {
    return this.$http.post(config.authTokenUrl, {
      username: username,
      password: password
    }).then(resp => {
      this._setAuth(resp.data.token, resp.data.id);
      return this.setUser(resp.data.id);
    }, err => {
      this._clearAuth();
      return this.$q.reject(err);
    });
  }

  /**
  * Logs out the user by removing the auth token from the app.
  */
  logout () {
    this._clearAuth();
    this.request = this.$q.reject();
    if(this.user) {
      this.DS.clear();
      this.user = null;
    }
    this.onLogout();
  }

  oauth (provider, params) {
    return this.$http.get(config.oauthUrl + provider + '/', {
      params
    }).then(resp => {
      this._setAuth(resp.data.token, resp.data.id);
      return this.setUser(resp.data.id);
    }, err => {
      this._clearAuth();
      return this.$q.reject(err);
    });
  }

  /**
  * Sends a reset password request using the passed email or
  * this.user's primary_email
  */
  resetPassword (email=this.user.email) {
    return this.$http.post(config.resetPassword + email + '/');
  }

  /**
  * Prompts the current user to input a new password using the passed token.
  */
  changePassword (token) {
    let pass = prompt('Change Password');
    return this.User.changePassword(token, pass, pass).catch(err => {
      alert(err.error);
    });
  }

  /**
  * Sends a verification request using the passed verification token
  */
  verify (token) {
    return this.$http.post(`${config.emailVerify}${token}/`);
  }

  /**
  * Fetches the token and id for a user by email, and uses them.
  */
  impersonate (email) {
    return this.$http.post(config.impersonate, {
      email: email
    }).then(res => {
      this._setAuth(res.data.token, res.data.id);
      this.setUser(res.data.id).then(() => {
        this.$cookies.put('impersonating', true);
        location.reload();
      });
    });
  }

  /**
  * Returns true if the current session has an auth token stored. Returns
  * false otherwise.
  */
  isAuthenticated () {
    return !!this.$cookies.get('authToken');
  }

  /**
  * Promise that will resolve when the user is authenticated and reject
  * when they are not. Used for route based authentication.
  */
  requireLoggedIn () {
    if (this.isAuthenticated()) {
      return this.$q.resolve({
        auth: 'authenticated',
      });
    }
    return this.$q.reject({
      auth: 'not authenticated',
    });
  }

  resolveUser () {
    return this.request;
  }
}

angular
  .module('services.auth', [
    'ngCookies',
    'models.User',
    'services.session',
  ])
  .service('auth', AuthService)
  .run(authRun);