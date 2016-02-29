// Import global dependencies
import angular from 'angular';

// Import app to be bootstrapped.
import 'app/app';
require('./scss/main.scss')
require('angular-toastr/dist/angular-toastr.css');

console.log('why don\'t i work');

angular.element(document).ready(
  () => angular.bootstrap(document, ['PROJECT_NAME']));
