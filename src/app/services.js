import 'app/services/auth.service';
import 'app/services/session.service';
import 'app/services/notify.service';
import 'app/services/person.service';
import 'app/services/name.service';
import 'app/services/location.service';

angular.module('services', [
  'services.auth',
  'services.session',
  'services.notify',
  'services.person',
  'services.name',
  'services.location',
]);
