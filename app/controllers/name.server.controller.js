// Invoke 'strict' JavaScript mode
'use strict';

var Name = require('../../app/models/name.server.model').Name;
var humanNames = require('human-names');

exports.generateRandom = (parents, birthdate, birthplace, gender) => {
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

exports.addNew = (name) => {

}

exports.getRandomMaleFirstName = () => {

}

exports.getRandomFemaleFirstName = () => {

}
