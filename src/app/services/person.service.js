import 'app/services/models/Person.model';

class PersonService {
  /*@ngInject*/
  constructor (Person, name, location) {
    this.Person = Person;
    this.name = name;
    this.location = location;
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
    if(!birthdate) {
      birthdate = new Date();
    }
    if(!birthplace) {
      birthplace = this.location.random(`town`);
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

    this.people.push(newPerson);
  }

}


angular
  .module('services.person', [])
  .service('person', PersonService)
