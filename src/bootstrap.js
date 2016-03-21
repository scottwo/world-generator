// Import global dependencies
import angular from 'angular';

// Import app to be bootstrapped.
import 'app/app';
require('./scss/main.scss');


angular.element(document).ready(
  () => angular.bootstrap(document, ['PROJECT_NAME']));
