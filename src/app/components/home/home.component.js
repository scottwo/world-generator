import {BaseClass} from '../../base-class'

class HomeController extends BaseClass {
  constructor (Notify, $rootRouter, $rootScope, auth) {
    super($rootRouter, $rootScope, auth);
    this.title = `Home | PROJECT_TITLE`;
    Notify.info('Hello World!');
  }
}

angular
  .module('PROJECT_NAME.home', [])
  .component(`home`, {
    controller: HomeController,
    templateUrl: require(`./home.component.html`),
    bindings: {
      $router: `<`,
    }
  });
