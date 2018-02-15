(function () {
    'use strict';

    angular
        .module('naut')
        .constant('ngAuthSettings', {
            apiServiceBaseUri: 'http://localhost:7627/',
            clientId: 'SR_LOCAL',
            //apiServiceBaseUri: 'http://192.168.1.238:8085/',
            //clientId: 'SR_LIVE',
        });
        //.constant('clientId', moment);


})();