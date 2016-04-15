import '@angular/router/angular1/angular_1_router';
import 'js-data';
import 'js-data-angular';
import 'lodash';
import 'angular-animate';
import 'angular-cookies';
import 'angular-toastr';
import 'foundation-apps';
import 'foundation-tpls';


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
    'ngComponentRouter',
    'models',
    'modals',
    'services',
    'components',
    'PROJECT_NAME.home',
    'PROJECT_NAME.login',
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
