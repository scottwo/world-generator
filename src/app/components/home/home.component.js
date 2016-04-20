import {BaseClass} from '../../base-class'

class HomeController extends BaseClass {
  constructor ($rootRouter, auth, Notify) {
    super($rootRouter, auth);
    Notify.publish({
      title: 'Hello',
      content: 'World!',
    });
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
