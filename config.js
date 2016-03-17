(function (module) {
    'use strict';

    module.exports = {
        buildDir: 'build',
        compileDir: 'stg',
        releaseDir: 'bin',

        babelOptions: {
            modules: 'system',
            moduleIds: true
        },

        cssAutoPrefixerOptions: {
            cascade: true,
            remove: false
        },

        index: {
            // Define the load order of the scripts in index.html
            scripts: [
                'vendor/browser-polyfill.js',
                'vendor/es6-module-loader-sans-promises.src.js',
                'vendor/system.src.js',
                'vendor/extension-register.js',
                'vendor/lodash.js',
                'vendor/angular.js',
                'vendor/angular-ui-router.js',
                'vendor/angular-cookies.js',
                'vendor/angular-animate.js',
                'vendor/angular-toastr.tpls.js',
                'vendor/js-data.js',
                'vendor/js-data-angular.js',
                'templates.js',
                'config.js'
            ],
            styles: [
                'vendor/angular-toastr.css',
                'main.css'
            ]
        },

        devScripts: [
        ],

        rootFiles: [
            'src/favicon.ico',
            'src/robots.txt',
        ],

        appFiles: {
            // Grabs all of the assets for the app.
            assets: ['src/assets/**'],

            // Grab all .js files in the src/ directory and subdirectories aside
            // from tests and asset .js files.
            js: [
                'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js',
                '!src/bootstrap.js', '!src/config/computed.js'
            ],
            jsTest: ['src/**/*.spec.js'],

            // Grab all of the html template files.
            tpl: ['src/**/*.tpl.html'],

            // The main .html file for the SPA app.
            index: ['src/index.html'],

            // Maintenance html
            maintenance: ['src/maintenance.html'],

            // Generally there should only be one .scss file and all other files
            // should be imported from this one.
            scss: ['src/scss/main.scss'],

            delta: {
                js: [
                    'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js',
                    '!src/config/**', '.jshintrc'
                ],
                scss: ['src/**/*.scss', '.csslintrc']
            }
        },

        testFiles: {
            js: [
            ]
        },

        /*
         * Include all of the needed vendor files individually, since I can't
         * control how another package is structured I can't automate this
         * process.
         */
        vendor: {
            js: [
                'node_modules/babel-core/browser-polyfill.js',
                'node_modules/es6-module-loader/dist/' +
                    'es6-module-loader-sans-promises.src.js',
                'node_modules/systemjs/dist/system.src.js',
                'node_modules/systemjs/lib/extension-register.js',
                'node_modules/lodash/lodash.js',
                'node_modules/angular/angular.js',
                'node_modules/angular-ui-router/release/' +
                    'angular-ui-router.js',
                'node_modules/angular-cookies/angular-cookies.js',
                'node_modules/angular-animate/angular-animate.js',
                'node_modules/angular-toastr/dist/angular-toastr.tpls.js',
                'node_modules/js-data/dist/js-data.js',
                'node_modules/js-data-angular/dist/js-data-angular.js',
                'src/bootstrap.js'
            ],

            css: [
                'node_modules/angular-toastr/dist/angular-toastr.css',
            ],

            assets: [
            ],

            fonts: [
            ]
        }
    };
}(module));
