class HomeController {
    constructor (user) {
        this.user = user;
    }
}

function config ($stateProvider) {
    $stateProvider.state('PROJECT_NAME.home', {
        url: '',
        views: {
            'main@': {
                controller: 'HomeController',
                controllerAs: 'HomeCtrl',
                templateUrl: 'app/home/home.tpl.html'
            }
        },
        resolve: {
            loggedIn: auth => auth.requireLoggedIn(),
            user: (loggedIn, auth) => auth.resolveUser()
        }
    });
}

angular
    .module('PROJECT_NAME.home', [
        'ui.router',
    ])
    .config(config)
    .controller('HomeController', HomeController);
