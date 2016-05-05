var humanNames = require('human-names');

class NameService {
  /*@ngInject*/
  constructor () {

  }

  generateRandom(parents, birthdate, birthplace, gender) {
    let name = {};

    if(parents.length) {
      name.last = parents[0].name.last;
    } else {
      name.last = `Smith`;
    }

    if(gender === 'female') {
      name.first = humanNames.femaleRandomEn();
    } else {
      name.first = humanNames.maleRandomEn();
    }

    return name;
  }

  addNew(name) {

  }

  getRandomMaleFirstName() {

  }

  getRandomFemaleFirstName() {

  }

}


angular
  .module('services.name', [
  ])
  .service('name', NameService)
