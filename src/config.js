/*
-    module.exports = function (config) {
-        config.baseUrl = config.apiHost + '/';
-        config.apiUrl = config.baseUrl + 'api/';
-        config.authTokenUrl = config.baseUrl + 'api-token-auth/';
-        config.oauthUrl = config.baseUrl + 'social/';

-        config.changePassword = config.apiUrl + 'reset/';
-        config.resetPassword = config.apiUrl + 'reset-password/';
-        config.emailVerify = config.apiUrl + 'verify/';
-        config.impersonate = config.apiUrl + 'users/impersonate/';
-
-        return config;
*/

let createWithApiUrl = (str) => {
  return `${API_CONFIG.apiHost}/api/${str}/`;
};

let createUrl = (str) => {
  return `${API_CONFIG.apiHost}/${str}/`;
};

var config =  {
  createUrl: createUrl,
  baseUrl: `${API_CONFIG.apiHost}/`,
  apiUrl: createUrl('api'),
  authTokenUrl: createUrl('api-token-auth'),
  oauthUrl: createUrl('social'),

  changePassword: createWithApiUrl('reset'),
  resetPassword: createWithApiUrl('reset-password'),
  emailVerify: createWithApiUrl('verify'),
  impersonate: createWithApiUrl('users/impersonate')
};

config = Object.assign(API_CONFIG, config);
console.log(config);

export { config };
// let hello = 1 + 2;
// export { hello };
