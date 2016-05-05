/*@ngInject*/
function PersonFactory (DS, $http) {
  let Person = DS.defineResource({
    name: 'Person',
    endpoint: 'persons',
    relations: {

    },
    methods: {

    },
    computed: {

    }
  });

  return Person;
}

angular
.module('models.Person', [
  'js-data',
])
.factory('Person', PersonFactory)
.run(Person => Person);
