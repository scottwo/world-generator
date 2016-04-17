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

export { config };
