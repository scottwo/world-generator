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

    $httpProvider.interceptors.push('notifyInterceptor', 'errorInterceptor');
}

function errorInterceptor ($q) {
    function formErrorMessage (obj) {
        if(typeof obj !== 'object') {
            return obj;
        }
        let msg = '';
        if(obj instanceof Array) {
            msg += obj.map(formErrorMessage).join(', ');
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
        let error;
        switch(err.status) {
            case 500:
                error = 'Server Error';
                break;
            case 0:
                error = 'Unable to connect';
                break;
            default:
                error = formErrorMessage(err.data);
        }
        err.error = error;
        return $q.reject(err);
    }
    return {
        responseError: handleError,
        requestError: handleError
    };
}

function apiRun (DS, DSHttpAdapter, $q) {
    let fetched = {};

    function handlePagination (paging, page=1) {
        if(paging.control.abort) {
            paging.deferred.reject({error: 'Aborted', partial: paging.result});
            return;
        } else if(paging.control.done) {
            paging.deferred.resolve(paging.result);
            return;
        }

        paging.params.page = page;
        DSHttpAdapter.GET(paging.url, {params: paging.params}).then(res => {
            let objects = DS.inject(paging.model, res.data.results);
            Array.prototype.push.apply(paging.result, objects);
            paging.deferred.notify({
                result: paging.result,
                page: objects,
                progress: paging.result.length / res.data.count
            });

            if(!res.data.next) {
                paging.control.done = true;
            }
            handlePagination(paging, ++page);
        }, paging.deferred.reject);
    }

    DS.findAllPaged = function (model, params, opts) {
        let deferred = $q.defer(),
            url = DS.defaults.basePath + DS.definitions[model].endpoint,
            result = [],
            promise = deferred.promise;
        promise.$object = result;
        params = (params && typeof params === 'object') ? params : {};

        let cacheStr = model + '|';
        _.forOwn(params, (val, key) => {
            cacheStr += `${key}:${val}`;
        });

        let control = {abort: false, done: false};
        promise.abort = () => control.abort = true;
        promise.finish = () => control.done = true;

        if(fetched[cacheStr] && (!opts || opts.cache)) {
            let objects = DS.getAll(model);
            Array.prototype.push.apply(result, objects);
            deferred.resolve(result);
            return promise;
        }
        promise.finally(() => {
            fetched[cacheStr] = true;
        });

        handlePagination({
            model: model,
            url: url,
            result: result,
            deferred: deferred,
            params: params,
            control: control,
        });

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

    var clear = DS.clear.bind(DS);
    DS.clear = function (...args) {
        fetched = {};
        return clear(...args);
    };

    var ejectAll = DS.ejectAll.bind(DS);
    DS.ejectAll = function (model, ...args) {
        delete fetched[model];
        return ejectAll(model, ...args);
    };

    DS.getUrl = function (model) {
        return DS.defaults.basePath + DS.definitions[model].endpoint;
    };

    DS.getMasterArray = model => DS.store[model].collection;

    DS.fetchAll = function (model, ids) {
        return $q.all(
            ids.map(id => DS.find(model, id))
        );
    };

    function doAction (base, action) {
        let url = `${base}/${action}`;
        return {
            get: params => DSHttpAdapter.GET(url, {
                params: params
            }).then(res => res.data),
            post: (payload, params) => DSHttpAdapter.POST(url, payload, {
                params: params
            }).then(res => res.data),
            put: (payload, params) => DSHttpAdapter.PUT(url, payload, {
                params: params
            }).then(res => res.data)
        };
    }

    DS.detail = function (model, id, action) {
        return doAction(DS.getUrl(model) + '/' + id, action);
    };

    DS.patch = function (model, id, attrs, opts={}) {
        opts.method = 'PATCH';
        return DS.update(model, id, attrs, opts);
    };

    DS.list = function (model, list) {
        let base = DS.defaults.basePath + DS.definitions[model].endpoint,
            url = base + '/' + list;
        let actions = doAction(base, list);
        actions.getPaged = params => {
            let deferred = $q.defer();
            handlePagination({
                model: model,
                url: url,
                result: [],
                deferred: deferred,
                params: params
            });
            return deferred.promise;
        };
        return actions;
    };

    angular.extend(DS.defaults.methods, {
        DSPatch: function (attrs, opts) {
            return DS.patch(this.constructor.name, this.id, attrs, opts);
        },
        detail: function (action) {
            return doAction(this.getUrl(), action);
        },
        getUrl: function () {
            return DS.getUrl(this.constructor.name) + '/' + this.id;
        },
        debouncedUpdate: _.debounce(function () {
            let changes = this.DSChanges().changed;
            if(Object.keys(changes).length) {
                return this.DSPatch(changes, {cacheResponse: false});
            }
            return $q.reject();
        }, 500),
    });
}

angular
    .module('api', [
        'js-data',
    ])
    .factory('errorInterceptor', errorInterceptor)
    .config(apiConfig)
    .run(apiRun);
