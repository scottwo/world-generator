import 'js-data';
import 'js-data-angular';
import 'lodash';
import 'angular-animate';
import 'angular-cookies';
import 'angular-toastr';
import 'foundation-apps';
import 'foundation-tpls';

import 'app/home/home';
import 'app/login/login';
import 'app/services/models';
import 'app/modals';
import 'app/services';
import 'app/components';


function config($locationProvider) {
  $locationProvider.html5Mode(true);
}

class MainController {
  constructor () {}
}


angular
  .module('PROJECT_NAME', [
    'models',
    'modals',
    'services',
    'components',
    'foundation'
  ])
  .component('mainComponent', {
    controller: MainController,
    template: '<ng-outlet></ng-outlet>',
    $routeConfig: [
      {path: '/', name: 'Home', component: 'home'},
      {path: '/login/', name: 'Login', component: 'login'},
      {path: '/**', redirectTo: ['Home']},
    ],
  })
  .config(config)
  .value('$routerRootComponent', 'mainComponent');
