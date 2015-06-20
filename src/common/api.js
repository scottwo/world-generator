function apiConfig (DSProvider, DSHttpAdapterProvider, $httpProvider, config) {
    DSProvider.defaults.basePath = config.apiUrl;
    DSHttpAdapterProvider.defaults.forceTrailingSlash = true;
    DSHttpAdapterProvider.defaults.log = false;

    DSProvider.defaults.deserialize = (resourceName, res) => {
        let data = res.data;
        if (data && 'count' in data && 'next' in data && 'results' in data) {
            data = data.results;
            data._meta = {
                count: res.data.count,
                next: res.data.next,
                previous: res.data.previous
            };
        }
        return data;
    };

    $httpProvider.interceptors.push('errorInterceptor');
}

function errorInterceptor ($q) {
    function formErrorMessage (obj) {
        if(typeof obj !== 'object') {
            return obj;
        }
        let msg = '';
        if(obj instanceof Array) {
            msg += obj.map(item => formErrorMessage(item)).join(', ');
        } else {
            _.forOwn(obj, (val, key) => {
                if(['non_field_errors', 'detail'].indexOf(key) < 0) {
                    msg += key + ': ';
                }
                msg += formErrorMessage(val) + '\n';
            });
        }
        return msg;
    }
    function handleError (err) {
        err.error = err.status === 500 ?
            'Server Error' :
            formErrorMessage(err.data);
        return $q.reject(err);
    }
    return {
        responseError: handleError,
        requestError: handleError
    };
}

function apiRun (DS, DSHttpAdapter, $q) {
    let fetched = {};
    DS.findAllPaged = DS.findAllPaginated = function (model, params, opts) {
        let deferred = $q.defer(),
            url = DS.defaults.basePath + DS.definitions[model].endpoint,
            result = [],
            promise = deferred.promise;
        promise.$object = result;
        params = params && typeof params === 'object' ? params : {};

        if(fetched[model] && (!opts || opts.cache)) {
            let objects = DS.getAll(model);
            Array.prototype.push.apply(result, objects);
            deferred.resolve(result);
        } else {
            handlePagination();
        }

        function handlePagination (page=1) {
            params.page = page;
            DSHttpAdapter.GET(url, {params: params}).then(res => {
                let objects = DS.inject(model, res.data.results);
                Array.prototype.push.apply(result, objects);
                deferred.notify({
                    result: result,
                    page: objects,
                    progress: result.length / res.data.count
                });

                if(res.data.next) {
                    handlePagination(++page);
                } else {
                    fetched[model] = true;
                    deferred.resolve(result);
                }
            }, deferred.reject);
        }

        return promise;
    };

    var findAll = DS.findAll.bind(DS);
    DS.findAll = function (...args) {
        let deferred = $q.defer(),
            promise = deferred.promise,
            result = [];
        promise.$object = result;

        findAll(...args).then(objects => {
            Array.prototype.push.apply(result, objects);
            deferred.resolve(result);
        }, deferred.reject);

        return deferred.promise;
    };

    DS.fetchAll = function (model, ids) {
        return $q.all(
            ids.map(id => DS.find(model, id))
        );
    };

    DS.action = function (model, id, action) {
        let url = DS.defaults.basePath + DS.definitions[model].endpoint;
        url += `/${id}/${action}`;
        return {
            get: params => DSHttpAdapter.GET(url, {params: params}),
            post: (payload, params) => DSHttpAdapter.POST(url, payload, {
                params: params
            }),
            put: (payload, params) => DSHttpAdapter.PUT(url, payload, {
                params: params
            })
        };
    };

    DS.list = function (model, list) {
        let url = DS.defaults.basePath + DS.definitions[model].endpoint;
        url += '/' + list;
        return {
            get: params => DSHttpAdapter.GET(url, {params: params}),
            post: (payload, params) => DSHttpAdapter.POST(url, payload, {
                params: params
            }),
            put: (payload, params) => DSHttpAdapter.PUT(url, payload, {
                params: params
            })
        };
    };
}

angular
    .module('api', [
        'js-data'
    ])
    .factory('errorInterceptor', errorInterceptor)
    .config(apiConfig)
    .run(apiRun);
