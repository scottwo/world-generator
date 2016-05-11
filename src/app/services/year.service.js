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
    this.people.forEach(person => {
      if(!person.relationships.spouse && person.age > 14) {
        this.people.forEach(possibleMatch => {
          if(person !== possibleMatch &&
            person.relationships.father !== possibleMatch &&
            person.relationships.mother !== possibleMatch &&
            person.gender !== possibleMatch.gender &&
            !possibleMatch.relationships.spouse &&
            possibleMatch.age > 14) {
            person.relationships.spouse = possibleMatch;
            person.events.marriage = {
              date: this.currentYear
            };
            possibleMatch.relationships.spouse = person;
            possibleMatch.events.marriage = {
              date: this.currentYear
            };
            //Mazel Tov.
            marriedPeople.push(person);
          }
        });
      } else if (person.relationships.spouse) {
        marriedPeople.push(person);
      }
      //One year older and wiser, too.
      person.age++;
    });
    //then do births. Everyone has one baby per year.
    marriedPeople.forEach(person => {
      if(alreadyHadABaby.indexOf(person) === -1) {
        if(person.gender === 'male') {
          this.person.create({mother: person.relationships.spouse, father: person}, this.currentYear);
        } else {
          this.person.create({father: person.relationships.spouse, mother: person}, this.currentYear);
        }
        alreadyHadABaby.push(person, person.relationships.spouse);
      }
    });

    this.people.forEach(person => {
      if(person.age > Math.floor(Math.random()*(100-70+1)+70)) {
        person.events.death = {
          date: this.currentYear
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
