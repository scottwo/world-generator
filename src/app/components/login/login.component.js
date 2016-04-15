import 'app/services/auth';
import 'app/services/models/User';
import {config} from '../../../config';
import {BaseClass} from '../../base-class';

class LoginController extends BaseClass {
  constructor ($rootRouter, $rootScope, auth, User, Notify) {
    super($rootRouter, $rootScope, auth);
    this.assignArgs(this, arguments);
    this.title = `Login | PROJECT_NAME`;

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
      this.$router.navigate(['Home']);
    }, err => {
      this.Notify.toastr.error('Could not log in...');
      this.error = err.error;
    });
  }

  createUser(newUser) {
    this.User.create(newUser).then(() => {
      this.Notify.toastr.info('Please validate account before logging in.');
      this.$router.navigate(['Home']);
    }, err => {
      this.Notify.toastr.error('Could not create user...');
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

angular.module('components.login', [])
  .component('login', {
    controller: LoginController,
    templateUrl: require('components/login/login.tpl.html'),
    bindings: {$router: '<'},
  });
