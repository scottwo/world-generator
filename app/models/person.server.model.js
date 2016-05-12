var store = require('../../server').store;

var Person = store.defineResource({
  name: 'person',
  idAttribute: '_id',
  table: 'persons'
});

exports.Person = Person;
