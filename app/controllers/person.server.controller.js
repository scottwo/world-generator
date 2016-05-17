// Invoke 'strict' JavaScript mode
'use strict';

var Person = require('../../app/models/person.server.model').Person;
var Location = require('../../app/models/location.server.model').Location;
var Name = require('../../app/models/name.server.model').Name;
var location = require('../../app/controllers/location.server.controller');
var name = require('../../app/controllers/name.server.controller');
//Params:
//  parents: Array of person ids
//
exports.create = (parents, birthdate, birthplace) => {
  let childParents = {};
  let newPerson = {};
  let gender = 'female';
  if(Math.random() * 10 > 5) {
    gender = 'male';
  }
  if(!birthdate) {
    birthdate = new Date();
  }
  if(!birthplace) {
    birthplace = location.random(`town`);
  }
  // parents.forEach(id => {
  //   childParents.push(this.Person.get(id));
  // });
  if(!parents.mother && !parents.father) {
    childParents = this.randomParents({}, 2);
  } else {
    childParents = parents;
  }
  newPerson = {
    name: name.generateRandom(childParents, birthdate, birthplace, gender),
    age: 0,
    status: 'alive',
    gender: gender,
    relationships: {
      mother: childParents.mother,
      father: childParents.father,
      children: []
    },
    events: {
      birth: {
        date: birthdate,
        place: birthplace,
      }
    },
    // personality: this.generatePersonality(childParents, birthdate, birthplace),
    // characteristics: this.generateCharacteristics(childParents, birthdate, birthplace),
  }
  Person.create(newPerson);
  if(newPerson.relationships.mother) {
    this.addChild(newPerson.relationships.mother, newPerson);
  }
  if(newPerson.relationships.father) {
    this.addChild(newPerson.relationships.father, newPerson);
  }
}

exports.addChild = (parent, child) => {
  Person.find(parent._id).then(person => {
    person.relationships.children.push(child);
    person.DSSave();
  });
  // let index = this.people.indexOf(parent);
  // let childIndex = this.people.indexOf(child);
  // this.people[index].relationships.children.push(this.people[childIndex]);
}

exports.startWithTwoParents = () => {
  let birthplace = location.random('town');
  let birthdate = -14;
  let parents = {
    mother: {
      name: name.generateRandom([{name:{last:'Smith'}}], birthdate, birthplace, 'female'),
      gender: 'female',
      status: 'alive',
      age: 14,
      relationships: {
        mother: null,
        father: null,
        children: []
      },
      personality: {},
      characteristics: {},
      events: {
        birth: {
          date: birthdate,
          place: birthplace
        },
        marriage: {
          date: birthdate
        }
      }
    },
    father: {
      name: name.generateRandom([{name:{last:'Smith'}}], birthdate, birthplace, 'male'),
      gender: 'male',
      status: 'alive',
      age: 14,
      relationships: {
        mother: null,
        father: null,
        children: []
      },
      personality: {},
      characteristics: {},
      events: {
        birth: {
          date: birthdate,
          place: birthplace
        },
        marriage: {
          date: birthdate
        }
      }
    }
  };
  Person.create(parents.mother);
  Person.create(parents.father);
}
