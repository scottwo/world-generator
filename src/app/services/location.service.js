class LocationService {
  /*@ngInject*/
  constructor () {

  }

  random(type) {
    let all = this.getAll();
    let randomIndex = Math.floor(Math.random() * all.length);
    return all[randomIndex];
  }

  addNew(location) {

  }

  getAll() {
    return [
      'Arlynn',
      'Weston',
      'Belton',
      'Brookwood',
      'Arcon',
      'Timberidge',
    ]
  }

}


angular
  .module('services.location', [])
  .service('location', LocationService)
