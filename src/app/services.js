import 'app/services/auth.service';
import 'app/services/session.service';
import 'app/services/notify.service';
import 'app/services/person.service';

angular.module('services', [
  'services.auth',
  'services.session',
  'services.notify',
  'service.person'
]);
