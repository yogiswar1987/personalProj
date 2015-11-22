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
        var urlOpts = {
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
        return $http(urlOpts).success(function(data){
          sessionStorage.setItem("phone",signUpData.phone);
        });
      },
      checkReferralCode: function (referralCode) {
        var urlOpts = {
          method: 'GET',
          url: BASE_URL + 'QRUser/checkReferralCode?referralCode=' + referralCode
        };
        return $http(urlOpts);
      },
      login: function (user) {
        var urlOpts = {
          method: 'GET',
          url: BASE_URL +'QRUser/login?userId=' + user.phone + '&pwd=' + user.pwd
        };
        return $http(urlOpts).success(function(data){
          sessionStorage.setItem("phone",user.phone);
        }).error(function(data){
          sessionStorage.setItem("phone",user.phone);
        });
      },
      resetPassword:function (user){
        var urlOpts = {
          method: 'GET',
          url: BASE_URL +'QRUser/password?phone=' + user.phone
        };
        return $http(urlOpts);
      }
    }
  }]).factory('AccountService', ['$http',function ($http) {
    return {
      activateAccount: function (phone, activationCode) {
        var urlOpts = {
          method: 'GET',
          url: BASE_URL+'QRUser/activateAccount?userId=' + phone + '&activationCode=' + activationCode
        };
       return $http(urlOpts);

      },
      changePassword:function (phone, oldPassword,newPassword) {
        var urlOpts = {
          method: 'GET',
          url: BASE_URL+'QRUser/password?phone=' + phone + '&old_pwd='+oldPassword+'&new_pwd=' + newPassword
        };
        return $http(urlOpts);

      }
    }
  }]);
