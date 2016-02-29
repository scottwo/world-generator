import 'common/services/auth';
import 'common/models/User';
import {config} from 'config';
var loginHtml = require('./login.tpl.html');

class LoginController {
  constructor (auth, $state, $stateParams, User) {
    this.auth = auth;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.User = User;
    let oauth = [{
      provider: 'google-oauth2',
      name: 'Google',
      icon: '/assets/img/google.svg',
      url: 'https://accounts.google.com/o/oauth2/auth?response_type=code',
      scope: 'openid email profile',
    }, {
      provider: 'facebook',
      name: 'Facebook',
      icon: '/assets/img/facebook.png',
      url: 'https://www.facebook.com/dialog/oauth?',
      scope: 'email',
    }];

    if (config.oauth) {
      this.oauth = oauth.filter(o => o.client_id = config.oauth[o.provider]);
    }
  }

  login () {
    this.auth.login(this.username, this.password).then(() => {
      this.$state.go(
        this.$stateParams.redirectState,
        this.$stateParams.redirectParams
      );
    }, err => {
      this.error = err.error;
    });
  }

  reset () {
    if(this.username) {
      this.auth.resetPassword(this.username).then(() => {
        this.error = null;
        alert('Password Reset Email Sent');
      }, err => {
        this.error = err.error;
      });
    }
  }
}

function moduleConfig ($stateProvider) {
  $stateProvider.state('PROJECT_NAME.login', {
    url: 'login',
    params: {
      redirectState: 'PROJECT_NAME.home',
      redirectParams: null
    },
    views: {
      'main@': {
        controller: 'LoginController',
        controllerAs: 'LoginCtrl',
        templateUrl: loginHtml
      }
    },
    resolve: {
      $title: function() {return 'Login';},
      user: auth => auth.resolveUser().catch(() => {})
    },
    onEnter: ($state, user) => {
      if(user) {
        $state.go('PROJECT_NAME.home');
      }
    }
  });
  $stateProvider.state('PROJECT_NAME.logout', {
    url: 'logout',
    onEnter: auth => {
      auth.logout();
    }
  });
  $stateProvider.state('PROJECT_NAME.oauth', {
    url: 'oauth/:provider?code&state',
    onEnter: ($stateParams, $state, $cookies, Notify, auth) => {
      let provider = $stateParams.provider,
        storedState = $cookies.get(provider + '-state');
      if ($stateParams.state === storedState) {
        $cookies.remove(provider + '-state');
        auth.oauth(provider, {
          code: $stateParams.code,
          state: storedState
        }).then(() => {
          $state.go('PROJECT_NAME.home');
        }, () => {
          Notify.error('Unable to login using oauth', {timeOut: 0});
          $state.go('PROJECT_NAME.login');
        });
      } else {
        Notify.error('Invalid oauth state!', {timeOut: 0});
        $state.go('PROJECT_NAME.login');
      }
    }
  });
}

angular
.module('PROJECT_NAME.login', [
  'ui.router',
  'services.auth',
  'models.User',
])
.config(moduleConfig)
.controller('LoginController', LoginController);
