import {BaseClass} from '../../base-class'

class HomeController extends BaseClass {
  constructor ($rootRouter, auth, person, name) {
    super($rootRouter, auth);
    this.person = person;
    this.people = person.people;
  }

  makePerson() {
    this.person.create();
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
