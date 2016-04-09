import 'js-data';
import 'js-data-angular';
import 'lodash';
import 'angular-ui-router';
import 'angular-animate';
import 'angular-cookies';
import 'angular-toastr';
import 'foundation-apps';
import 'foundation-tpls';

import 'app/home/home';
import 'app/login/login';
import 'common/models';
import 'common/modals';
import 'common/services';
import 'common/directives';
import 'common/components';


/*@ngInject*/
function config ($urlRouterProvider, $locationProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $stateProvider.state('PROJECT_NAME', {
    url: '/',
    abstract: true
  });
}

class MainController {
  constructor () {

  }
}

/*@ngInject*/
function run ($rootScope, $window, $timeout, $state) {
  $rootScope.$on('$stateChangeStart', () => {
    $window.scrollTo(0,0);
  });

  // adapted from angular-ui-router-title
  $rootScope.updateTitle = updateTitle;
  $rootScope.$on('$stateChangeSuccess', (/*evt, to, toP, from*/) => {
    updateTitle(getTitleValue($state.$current.locals.globals.$title));
    //        if(!$window.ga || !from.name) {
    //            return;
    //        }
    //        $window.ga('send', 'pageview', {page: $location.path()});
  });

  function updateTitle (title) {
    $timeout(() => {
      $rootScope.$title = title;
    });

    $rootScope.$breadcrumbs = [{
      title,
      state: $state.$current.self.name,
      stateParams: $state.$current.locals.globals.$stateParams,
    }];
    var state = $state.$current.parent;
    while(state) {
      if(state.resolve && state.resolve.$title) {
        $rootScope.$breadcrumbs.unshift({
          title: getTitleValue(state.locals.globals.$title),
          state: state.self.name,
          stateParams: state.locals.globals.$stateParams
        });
      }
      state = state.parent;
    }
  }

  function getTitleValue (title) {
    return angular.isFunction(title) ? title() : title;
  }
}

angular
.module('PROJECT_NAME', [
  'ui.router',
  'models',
  'modals',
  'services',
  'directives',
  'PROJECT_NAME.home',
  'PROJECT_NAME.login',
  'foundation'
])
.config(config)
.run(run)
.controller('MainController', MainController);
