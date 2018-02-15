(function () {
    'use strict';

    angular
        .module('naut', ['ui.bootstrap']).run(function () {
            $.toaster({
                settings: {
                    timeout: 50000,
                    toaster: {
                        css: {
                            width: '100%;'
                        }
                    }
                }
            });

        });


})();