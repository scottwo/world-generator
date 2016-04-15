let template = require('./socialAuth.tpl.html');

function rand () {
  return Math.ceil(Math.random() * 1000000000000);
}

class socialAuth {
  constructor () {
    Object.assign(this, {
      controller: socialAuthController,
      templateUrl: template,
      bindings: {
        oauth: '=',
      }
    });
  }
}

class socialAuthController {
  /*@ngInject*/
  constructor ($cookies) {
    let redirect = `${location.protocol}//${location.host}/oauth/`,
    state = rand();
    $cookies.put(this.oauth.provider + '-state', state);

    this.url = (
      this.oauth.url +
      `&client_id=${this.oauth.client_id}` +
      `&scope=${this.oauth.scope}` +
      `&redirect_uri=${redirect + this.oauth.provider}` +
      `&state=${state}`
    );
  }
}

angular.module('components.socialAuth', ['ngCookies'])
  .component('socialAuth', new socialAuth());
