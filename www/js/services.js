angular.module('quickRide')
  .factory('SignUpService',['$http',function ($http) {
    return {
      signUp: function (signUpData) {
        signUpData.gender = "M";
        var urlOpts1 = {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          url: BASE_URL+'QRUser',
          transformRequest: function (obj) {
            var str = [];
            for (var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: signUpData
        };
        return $http(urlOpts1);
      }
    }
  }]);
