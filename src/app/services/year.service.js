class YearService {
  /*@ngInject*/
  constructor (person, location) {
    this.currentYear = 0;
    this.person = person;
    this.location = location;
    this.people = person.people;
  }

  generateMultipleYears(numOfYears) {
    if(this.currentYear === 0) {
      this.generateYearOne();
      numOfYears--;
    }
    for(let i = 0; i < numOfYears; i++) {
      this.generateYear();
    }
  }

  //Here we want to have marriages and births and deaths occur.
  //Literally, any change that happens will be initiated by this function.
  //This is the heartbeat of the generator.
  generateYear() {
    let marriedPeople = [];
    let alreadyHadABaby = [];
    //first do marriages, people get married as soon as able.
    this.people.forEach((person, indy) => {
      if(person.status == 'deceased') {
        return;
      }
      if(!person.relationships.spouse && person.age > 14) {
        this.people.forEach((possibleMatch, index) => {
          if(person !== possibleMatch &&
          person.relationships.father !== possibleMatch &&
          person.relationships.mother !== possibleMatch &&
          person.gender !== possibleMatch.gender &&
          !possibleMatch.relationships.spouse &&
          possibleMatch.age > 14) {
            if(person.gender === 'female' && person.age > 40 ||
            possibleMatch.gender === 'female' && possibleMatch.age > 40 ||
            person.relationships.spouse) {
              return;
            }
            this.people[indy].relationships.spouse = possibleMatch;
            this.people[indy].events.marriage = {
              date: this.currentYear
            };
            this.people[index].relationships.spouse = person;
            this.people[index].events.marriage = {
              date: this.currentYear
            };
            //Mazel Tov.
            marriedPeople.push(this.people[indy], this.people[index]);
          }
        });
      } else if (person.relationships.spouse && marriedPeople.indexOf(person) === -1) {
        marriedPeople.push(person);
      }
      //One year older and wiser, too.
      person.age++;
    });
    //then do births. Everyone has one baby per year.
    marriedPeople.forEach(person => {
      if(person.status == 'deceased') {
        return;
      }
      if(person.gender === 'female' && person.age > 40 ||
      person.relationships.spouse.gender === 'female' && person.relationships.spouse.age > 40) {
        return;
      }
      if(alreadyHadABaby.indexOf(person) === -1 && person.relationships.children.length < 10) {
        if(person.gender === 'male') {
          this.person.create({mother: person.relationships.spouse, father: person}, this.currentYear);
        } else {
          this.person.create({father: person.relationships.spouse, mother: person}, this.currentYear);
        }
        alreadyHadABaby.push(person, person.relationships.spouse);
      }
    });

    this.people.forEach(person => {
      if(person.status == 'deceased') {
        return;
      }
      //We'll just have them die anywhere from 35 to 55 for us.
      //Add child mortality/birthing mortality/etc later.
      if(person.age > Math.floor(Math.random()*(55-35+1)+35)) {
        person.events.death = {
          date: this.currentYear,
          place: this.location.random('town')
        };
        person.status = 'deceased';
      }
    });
    this.incrementYear();
  }

  generateYearOne() {
    this.person.startWithTwoParents();
    this.incrementYear();
  }

  incrementYear() {
    this.currentYear++;
  }

}


angular
  .module('services.year', [])
  .service('year', YearService)
