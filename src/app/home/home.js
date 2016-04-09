let HomeTpl = require('./home.tpl.html');

class HomeController {
  /*@ngInject*/
  constructor (user, Notify) {
    this.user = user;
    Notify.info('Hello World!');
  }
}

/*@ngInject*/
function config ($stateProvider) {
  $stateProvider.state('PROJECT_NAME.home', {
    url: '',
    views: {
      'main@': {
        controller: 'HomeController',
        controllerAs: 'HomeCtrl',
        templateUrl: HomeTpl
      }
    },
    resolve: {
      $title: () => 'Home',
      loggedIn: auth => auth.requireLoggedIn(),
      user: (loggedIn, auth) => auth.resolveUser()
    }
  });
}

angular
.module('PROJECT_NAME.home', [
  'ui.router',
])
.config(config)
.controller('HomeController', HomeController);
