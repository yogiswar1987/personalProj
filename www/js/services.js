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
      },
      checkReferralCode: function(referralCode){
        var urlOpts1 = {
          method: 'GET',
          url: BASE_URL+'QRUser/checkReferralCode?referralCode='+referralCode
        };
        return $http(urlOpts1);
      }
    }
  }]).factory('AccountService',[function(){
    return {
      activateAccount: function (phone, activationCode) {
        var deferred = $q.defer();
        var urlOpts1 = {
          method: 'GET',
          url: 'dishaapiserver/rest/user/activateAccount?userId=' + phone + '&activationCode=' + activationCode,
          transformResponse: specialTransform
        };
        $http(urlOpts1)
          .success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).
          error(function (data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      }
    }
  }]);
