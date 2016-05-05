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
    // parents.forEach(id => {
    //   childParents.push(this.Person.get(id));
    // });
    if(!parents.length) {
      childParents = this.randomParents({}, 2);
      console.log(childParents);
    }
    newPerson = {
      name: this.name.generateRandom(childParents, birthdate, birthplace, gender),
      gender: gender,
      birthdate: birthdate,
      birthplace: birthplace,
      relationships: {
        mother: childParents.mother,
        father: childParents.father,
        children: []
      },
      // personality: this.generatePersonality(childParents, birthdate, birthplace),
      // characteristics: this.generateCharacteristics(childParents, birthdate, birthplace),
    }
    this.people.push(newPerson);
    if(newPerson.relationships.mother) {
      this.addChild(newPerson.relationships.mother, newPerson);
    }
    if(newPerson.relationships.father) {
      this.addChild(newPerson.relationships.father, newPerson);
    }
  }

  addChild(parent, child) {
    let index = this.people.indexOf(parent);
    let childIndex = this.people.indexOf(child);
    this.people[index].relationships.children.push(this.people[childIndex]);
  }

  randomParents(obj, num) {
    if(this.people.length < 2) {
      return {};
    }
    let person = _.sample(this.people);
    if(obj.father === person || obj.mother === person) {
      return this.randomParents(obj, num);
    }
    if(obj.father && obj.father.relationships.children.indexOf(person) !== -1 || obj.mother && obj.mother.relationships.children.indexOf(person) !== -1) {
      return this.randomParents(obj, num);
    }
    if(num >= 2) {
      if(person.gender === 'female') {
        obj.mother = person;
      } else {
        obj.father = person;
      }
      return this.randomParents(obj, num - 1);
    } else {
      if(person.gender === 'female') {
        obj.mother = person;
      } else {
        obj.father = person;
      }
      return obj;
    }
  }

}


angular
  .module('services.person', [])
  .service('person', PersonService)
