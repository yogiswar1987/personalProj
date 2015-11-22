angular.module('quickRide')
  .factory('AuthenticationService', ['$http', function ($http) {
    var phone;
    return {
      getPhone: function(){
        if(!phone){
          phone = sessionStorage.getItem("phone");
        }
        return phone;
      },
      signUp: function (signUpData) {
        signUpData.gender = "M";
        var urlOpts1 = {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          url: BASE_URL + 'QRUser',
          transformRequest: function (obj) {
            var str = [];
            for (var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: signUpData
        };
        return $http(urlOpts1).success(function(data){
          sessionStorage.setItem("phone",signUpData.phone);
        });
      },
      checkReferralCode: function (referralCode) {
        var urlOpts1 = {
          method: 'GET',
          url: BASE_URL + 'QRUser/checkReferralCode?referralCode=' + referralCode
        };
        return $http(urlOpts1);
      },
      login: function (user) {
        var urlOpts1 = {
          method: 'GET',
          url: BASE_URL +'QRUser/login?userId=' + user.phone + '&pwd=' + user.pwd
        };
        return $http(urlOpts1).success(function(data){
          sessionStorage.setItem("phone",user.phone);
        }).error(function(data){
          sessionStorage.setItem("phone",user.phone);
        });
      }
    }
  }]).factory('AccountService', ['$http',function ($http) {
    return {
      activateAccount: function (phone, activationCode) {
        var urlOpts1 = {
          method: 'GET',
          url: BASE_URL+'QRUser/activateAccount?userId=' + phone + '&activationCode=' + activationCode
        };
       return $http(urlOpts1);

      }
    }
  }]);
