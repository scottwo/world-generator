class Person {
  /*@ngInject*/
  constructor () {

  }

  //Params:
  //  parents: Array of person ids
  //
  create(parents) {
    
  }

}


angular
  .module('services.person', [])
  .service('Person', Person)
