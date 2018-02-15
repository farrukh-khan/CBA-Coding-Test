'use strict';

app.factory('backendHubProxy', ['$rootScope', 'backendServerUrl',
  function ($rootScope, backendServerUrl) {

      function backendFactory(serverUrl, hubName) {
          var connection = $.hubConnection(backendServerUrl);
          var proxy = connection.createHubProxy(hubName);

          console.log("proxy:" + hubName);

          connection.start().done(function () {
              console.log('start connection');

          });

        
          return {
              on: function (eventName, callback) {
                  proxy.on(eventName, function (result) {

                      //console.log("result:" + result);
                      //$rootScope.$apply(function () {
                          if (callback) {
                              callback(result);
                          }
                      //});
                  });
              },
              invoke: function (methodName, callback) {
                  console.log('methodName:' + methodName);

                  proxy.invoke(methodName)
                  .done(function (result) {
                      $rootScope.$apply(function () {
                          if (callback) {
                              callback(result);
                          }
                      });
                  });
              }
          };



      };

      return backendFactory;
  }]);