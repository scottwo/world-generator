import {BaseClass} from '../../base-class'

class HomeController extends BaseClass {
  constructor ($rootRouter, auth, person, name, year) {
    super($rootRouter, auth);
    this.person = person;
    this.people = person.people;
    this.year = year;
    this.numOfYears = 1;
  }

  makePerson() {
    this.person.create();
  }

  makeParents() {
    this.person.startWithTwoParents();
  }

  startGenerating() {
    this.year.generateMultipleYears(this.numOfYears);
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
