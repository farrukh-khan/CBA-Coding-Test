var app = angular
    .module('naut', [
        'ngRoute',
        'ngAnimate',
        'ngStorage',
        'ngCookies',
        'ngSanitize',
        'ngResource',
        'LocalStorageModule',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.utils',
        'oc.lazyLoad',
        'cfp.loadingBar',
        'tmh.dynamicLocale',
        'pascalprecht.translate',
        'bw.paging',
        'n3-pie-chart',
        'angularFileUpload',
        'mdo-angular-cryptography',
        'ngPrint',
        'textAngular',
        'angular-ladda',
        'ja.qr',
        'duScroll'
        //'ng.deviceDetector'
        //'angular-loading-bar'
    ])
    //values for duScroll
    .value('duScrollDuration', 1000)
    .value('duScrollOffset', 140);

app.constant('ngAuthSettings', {
    apiServiceBaseUri: 'http://localhost:7627/',
    clientId: 'SR_LOCAL',
});

app.config(function ($httpProvider) {

    $httpProvider.interceptors.push('authInterceptorService');
});

app.config(['$cryptoProvider', function ($cryptoProvider) {
    $cryptoProvider.setCryptographyKey('ABCD123');
}]);

app.run(['authService', '$rootScope', function (authService, $rootScope) {
    $rootScope.numberOnlyPattern = '^[0-9]*$';
    $rootScope.alphaNumbericPattern = '^[a-zA-Z ]*$';
    $rootScope.cnicPattern = '/^\d{5} \d{7} \d{1}$/i';
    $rootScope.dateTimeFormat = "dd-MM-yyyy  h:mm a";
    $rootScope.dateTimeAtFormat = "dd-MM-yyyy 'at' h:mma";
    //set toaster
    $.toaster({
        settings: { timeout: 5000 }
    });

    authService.fillAuthData();
    if (authService.authentication != null) {
        $rootScope.userRoleId = authService.authentication.roleId;
        $rootScope.userRoleName = authService.authentication.roleName.toLowerCase();

        $rootScope.isAdmin = ($rootScope.userRoleName == 'admin' && $rootScope.userRoleName == 'superadmin' && $rootScope.userRoleName == 'systemrole');
    }
    var roteData = $rootScope;

    $rootScope.$on('$stateChangeStart', function (event, next, current) {
        roteData = $rootScope;
    })

    $rootScope.$on('$stateChangeSuccess', function (event, next, current) {
        $rootScope = roteData;
    })

    $rootScope.textAngularToolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        //['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
        //['html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
    ];
}]);

app.directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hover(function () {
                // on mouseenter
                $(element).tooltip('show');
            }, function () {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('jqdatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs) {
            element.datepicker({
                dateFormat: 'dd/mm/yy',
                onSelect: function (date) {
                    scope.date = date;
                    scope.$apply();
                }
            });
        }
    };
});

app.directive('loading', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="loading"><img src="/app/img/loderImg.gif" width="200" height="200" style="position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);transform: -webkit-translate(-50%, -50%);transform: -moz-translate(-50%, -50%);transform: -ms-translate(-50%, -50%);color:darkred;"></div>',
        link: function (scope, element, attr) {
            scope.$watch('loading', function (val) {
                if (val)
                    $(element).show();
                else
                    $(element).hide();
            });
        }
    }
})
app.directive('dExpandCollapse', function () {

    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {

            $(element).click(function () {
                //var show = "false";
                $(element).find(".answer").slideToggle('200', function () {
                    // You may toggle + - icon     
                    $(element).find("span").toggleClass('faqPlus faqMinus');
                });


                if ($("div.answer:visible").length > 1) {

                    $(this).siblings().find(".answer").slideUp('slow');
                }


            });

        }
    }
})

