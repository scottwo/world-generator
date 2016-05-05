/*@ngInject*/
function NameFactory (DS, $http) {
  let Name = DS.defineResource({
    name: 'Name',
    endpoint: 'names',
    relations: {

    },
    methods: {

    },
    computed: {

    }
  });

  return Name;
}

angular
.module('models.Name', [
  'js-data',
])
.factory('Name', NameFactory)
.run(Name => Name);
