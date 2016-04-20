class Notify {
  /*@ngInject*/
  constructor (FoundationApi) {
    this.FoundationApi = FoundationApi;
  }

  publish (options) {
    /*
    OPTIONS:
        title: 'string'
        content: 'string'
        image: 'url string'
        color: 'success', 'info', 'warning', or 'alert'
        autoclose: number of milliseconds
    override/add to default Foundation notification styles in _settings.scss
    */
    if (!options.color) options.color = 'info';
    if (!options.autoclose) options.autoclose = 3000;
    this.FoundationApi.publish('main-notifications', options);
  }

  serverError (error) {
    if(!error) {
      console.error('Programming Error: Server Error was null/undefined');
      this.publish({color: 'alert', title: 'Service Error'});
    } else if(!error.status) {
      console.error(error);
      this.publish({color: 'alert', title: 'Unable to connect to server!'});
    } else if(error.status === 400) {
      this.publish({
        color: 'warning',
        title: 'Invalid Request',
        content: error.error
      });
    } else if(error.status === 401) {
      this.publish({
        color: 'warning',
        title: 'Login Failure',
        content: error.error
      });
    } else {
      console.error(error);
      this.publish({color: 'alert', title: 'Server Error'});
    }
  }
}

/*@ngInject*/
function notifyInterceptor ($q, $injector) {
  var errors = [0, 400, 403, 500],
    Notify;

  function handleError (err) {
    if(!Notify) {
      Notify = $injector.get('Notify');
    }
    if(errors.indexOf(err.status) >= 0) {
      Notify.serverError(err);
    }
    return $q.reject(err);
  }

  return {
    responseError: handleError,
    requestError: handleError
  };
}

angular
  .module('services.notify', [])
  .service('Notify', Notify)
  .factory('notifyInterceptor', notifyInterceptor);
