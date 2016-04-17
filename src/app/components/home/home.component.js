import {BaseClass} from '../../base-class'

class HomeController extends BaseClass {
  constructor (Notify, $rootRouter, auth) {
    super($rootRouter, auth);
    Notify.info('Hello World!');
  }
}

angular
  .module('components.home', [])
  .component(`home`, {
    controller: HomeController,
    templateUrl: require(`./home.component.html`),
    bindings: {
      $router: `<`,
    }
  });
