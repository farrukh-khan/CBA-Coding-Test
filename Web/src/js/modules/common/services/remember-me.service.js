'use strict';
/* Services */
// Creates a cookie that expires in a year
app.factory('$remember', function () {

    var rememberMe = {};

    var _set = function (name, values) {
        
        var cookie = name + '=';

        cookie += values + ';';

        var date = new Date();
        date.setDate(date.getDate() + 365);

        cookie += 'expires=' + date.toString() + ';';
        
        document.cookie = cookie;
    };
    var _get =  function (cname) {
        
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    rememberMe.set = _set;
    rememberMe.get = _get;
    return rememberMe;

});


// removes the cookie

app.factory('$forget', function() {
    return function(name) {
        var cookie = name + '=;';
        cookie += 'expires=' + (new Date()).toString() + ';';

        document.cookie = cookie;
    }
});