// Invoke 'strict' JavaScript mode
'use strict';

var Location = require('../../app/models/location.server.model').Location;

exports.random = (type) => {
  if(type === 'town') {
    let all = this.getAll();
    let randomIndex = Math.floor(Math.random() * all.length);
    return all[randomIndex];
  }
}

exports.getAll = () => {
  return [
    'Arlynn',
    'Weston',
    'Belton',
    'Brookwood',
    'Arcon',
    'Timberidge',
  ];
}

exports.create = () => {

}
