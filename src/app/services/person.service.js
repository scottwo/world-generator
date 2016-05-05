import 'app/services/models/Person.model';

class PersonService {
  /*@ngInject*/
  constructor (Person, name) {
    this.Person = Person;
    this.name = name;
    this.people = [];
  }

  //Params:
  //  parents: Array of person ids
  //
  create(parents=[], birthdate, birthplace) {
    let childParents = [];
    let newPerson = {};
    let gender = 'female';
    if(Math.random() * 10 > 5) {
      gender = 'male';
    }
    parents.forEach(id => {
      childParents.push(this.Person.get(id));
    });
    newPerson = {
      name: this.name.generateRandom(childParents, birthdate, birthplace, gender),
      birthdate: birthdate,
      birthplace: birthplace,
      relationships: [].concat(childParents),
      // personality: this.generatePersonality(childParents, birthdate, birthplace),
      // characteristics: this.generateCharacteristics(childParents, birthdate, birthplace),
    }
    console.log(newPerson);
    this.people.push(newPerson);
  }

}


angular
  .module('services.person', [])
  .service('person', PersonService)
