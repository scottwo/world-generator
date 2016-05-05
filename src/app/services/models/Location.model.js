/*@ngInject*/
function LocationFactory (DS, $http) {
  let Location = DS.defineResource({
    name: 'Location',
    endpoint: 'locations',
    relations: {

    },
    methods: {

    },
    computed: {

    }
  });

  return Location;
}

angular
.module('models.Location', [
  'js-data',
])
.factory('Location', LocationFactory)
.run(Location => Location);
