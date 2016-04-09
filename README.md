# Izeni Angular Template v0.1.0

This project provides a build process for using ES6 code that will be transpiled down to ES5/ES3 compatible code so it can be run in most browsers even if they don't support ES6 yet.

The build process is set up to use the SystemJS module loader during development, when compiled to production the code is concatenated and minified into one file and removes the need for SystemJS to be included. Once ES6 and HTTP/2.0 have better support in browsers the need for concatenated and minified files should go away. Until then this concatenated code is here to stay.

The project also contains several pre-built features: an Auth service (cookie based), js-data, a User model, and home / login states.

Also, js-data has been modified to play nice with DRF. It handles the deserialization of responses that contain paginated meta data. Additional resource methods have been defined such as `findAllPaged`, `list`, `patch`, and `paging` (detailed below). Three instance methods have been added as `DSPatch`, `detail`, and `debouncedUpdate`. View `src/common/api.js` to inspect their implementation details.

Lastly, a $http response interceptor has been defined which will attempt to parse DRF error responses and create a human readable string, which is attached to the promise rejection as `rejection.error`.
(e.g. `User.patch(changes).catch(err => alert(err.error));`)


## Quick Setup
```bash
bash <(wget -q0- https://dev.izeni.net/izeni/izeni-angular-template/raw/master/startproject.sh) <project_name>
```

## Manual Setup
Set your project name as an environment variable
Set your project name as an environment variable
```bash
PROJECT_NAME=[your project name here]
```
And run the following commands:
```bash
git clone git@dev.izeni.net:izeni/izeni-angular-template.git
mv izeni-angular-template $PROJECT_NAME
cd $PROJECT_NAME
find . -type f -print0 | xargs -0 sed -i "s/PROJECT_NAME/$PROJECT_NAME/g"
npm install
npm install webpack -g (one time, likely requires sudo)
npm install webpack-dev-server -g (one time, likely requires sudo)
webpack-dev-server --inline --hot
```
Your project should be running on <http://localhost:8080/>

And don't forget to change the git origin to match your project's:
```bash
git remote set-url origin [your project's clone url]
```

## Commands

### `webpack-dev-server`
This is what you'll be using for most of development.
For more options visit: <https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli>

### `webpack`
This is what you'll use for production.
for more options visit: <https://webpack.github.io/docs/cli.html#pure-cli>

## Change Environment
You can change env
`NODE_ENV=dev webpack-dev-server --inline --hot`


## Documentation for Custom JS-Data Methods

### `patch` and `DSPatch` instance method
Same as DS.update, but overrides the HTTP Method to use `PATCH`.

### `list`
Used in tandem with DRF's `list_route`. Calling `Resource.list('a_list_route')` yields an object that contains five functions: `get`, `put`, `post`, `patch`, and `paging`.
Calling those commands makes the appropriate request to the resource's endpoint concatenated with `a_list_route`.

### `detail` instance method
Used in tandem with DRF's `detail_route`. Operates in the same manner as the `list` method above.

### `debouncedUpdate`
Will update a model at most once per 500 milliseconds. When `debouncedUpdate` is called, it will return the same promise for each debounce period.

### `paging`
Returns a pagination cursor.

Usage:
```
paging = User.paging(params, options);
paging.init();

paging.meta; // ->
{
  currentPage, // int, current page (starting from 1)
  fetchingPage, // int, the page currently being fetched
  pageCount, // int, number of pages
  pageSize, // int, instances per page
  totalCount, // int, the total number of instances in all pages
}

// The instances for paging.meta.currentPage
paging.page; // -> [...]

// All instances that have been fetched by the cursor.
paging.all; // -> [...]

// Loads the next page (and prefetches the next page(s))
paging.next(); // -> Promise

// Loads the previous page (and prefetches)
paging.prev(); // -> Promise

// Loads the requested page, and prefetches the pages before and after that page
paging.loadPage(pageNumber, prefetchRadius) // -> Promise

// Fetches all pages. If parallelBool is true, it sends the request for all pages at the same time.
// if parallelBool is false, it fetches a page at a time, but you can also access the results as
// they are retrieved at Promise.results, and you can abort the serial request using Promise.abort()
paging.fetchAll(parallelBool) // -> Promise

// True if the cursor is currently on the first page
paging.start; // -> Boolean

// True if the cursor is currently on the last page
paging.end; // -> Boolean

// True if all instances from all pages have been loaded
paging.allLoaded // -> Boolean
```

Default Options:
```
{
    cacheResponse: true,
    pageQueryParam: 'page',
    fetchAll: false,
    prefetch: 1,
}
```
Additional (non default) Options:
{
    pageSize, // int
    pageSizeQueryParam, // str
    list, // str (list_route)
}


### `findAllPaged`
Uses the `paging` method above, but immediately calls `fetchAll` and returns the result.

## Using Oauth
There are two oauth providers configured by default (Facebook and Google) that belong to the goog-dev@izeni.com accounts.

To use oauth, you must first locate the correct Python Social Auth provider name (e.g. 'facebook' or 'google-oauth2')

Then, obtain a client ID and secret from the provider's website (e.g. developers.facebook.com) as well as add a link to the redirect_uri configuration in the format of http(s)://[domain]/oauth/[provider]
e.g.
```
http://local.izeni.net:9000/oauth/facebook
or
https://izeni.com/oauth/facebook
```

Save the client ID in the appropriate config file under the `oauth` key. It should be in the format of
`"provider_name": "client_id"` e.g. `"facebook": "1649988431884827"`

The secret is _not_ saved on the client.

To initiate the oauth process, we have to link to the provider's oauth login page using the correct redirect_uri (and scope, if necessary)
The `oauth` directive can generate those links using configuration which can be found in `src/app/login/login.js`
That configuration requires a `provider` (same as above, e.g. "google-oauth2") a `url`, and optionally a `scope` (which differs with each provider, refer to PSA documentation)

Lastly, after the user initiates the oauth process, they are redirect back to the `redirect_uri`,
which is caught by the `oauth` state. The oauth state then sends a request to the server:
`/social/facebook?code=[code]&state=[state]` which then returns a token. If a user didn't exist for the email that the oauth provider passed along, a new user will be created in that same call.


### buildHtml
This task will take all of the `*.tpl.html` files and put them into one angular module that will use angulars templateCache to store them. All you need to do is make sure the `htmlTemplates` module is included in your app somewhere preferably in `app.js`.

## Tests
Tests are a bit tricky to get running with ES6 code, but that's one of the main reasons why I made this template. All tests can run ES6 code and you will need to use `import` statements to import the module you are testing. Everything should work as expected, but you have the advantage of using ES6 in your tests. Yay!

Basically what I've done to make it work is delay the start of the karma test runner until all modules have been loaded. Once they are karma will continue like normal and everything should work.
