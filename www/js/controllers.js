angular.module('quickRide')

  .controller('HomeCtrl', ['$rootScope', '$scope', '$ionicModal', '$timeout', '$location', 'AuthenticationService',
    function ($rootScope, $scope, $ionicModal, $timeout, $location, authenticationService) {
      $rootScope.showNavBar = false;
      $scope.logout = function () {
        authenticationService.logout();
        $location.path('#/auth/landing');
      };

    }])
  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];
  })

  .controller('SignUpCtrl', function ($rootScope, $scope, $ionicPopup, AuthenticationService, $location) {

    $rootScope.showNavBar = true;
    $scope.signUpData = {};
    // Triggered on a button click, or some other target
    $scope.showPopup = function () {
      $scope.data = {}

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="signUpData.promocode">',
        title: 'Apply your promo code',
        scope: $scope,
        buttons: [
          {
            text: '<b>Apply</b>',
            type: 'button-balanced',
            onTap: function (e) {
              if (!$scope.signUpData.promocode) {
                e.preventDefault();
              } else {
                AuthenticationService.checkReferralCode($scope.signUpData.promoode).success(function (data) {
                  var alertPopup = $ionicPopup.alert({
                    template: data
                  });
                  alertPopup.then(function (res) {
                    console.log('promo code alert closed');
                  });
                }).error(function (error) {
                  var alertPopup = $ionicPopup.alert({
                    template: error.resultData.userMsg
                  });
                  alertPopup.then(function (res) {
                    console.log(error);
                  });
                });
              }
            }
          },
          {text: 'Cancel'}
        ]
      });
      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });
    };

    $scope.signUp = function (signUpForm) {
      if (signUpForm.$valid) {
        AuthenticationService.signUp($scope.signUpData).success(function (data) {
          $location.path('auth/accountActivation');
          console.log(data);
        }).error(function (error) {
          console.log(error);
        });
      }
    }
  })
  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  }).controller('LandingCtrl', function ($scope, $ionicModal, $timeout, ngFB, AuthenticationService, $location, $rootScope) {
    if (AuthenticationService.isSessionValid()) {
      $location.url('app/browse');
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      var p = $location.path();
      if (p.indexOf('auth') == -1 && !AuthenticationService.isSessionValid()) {
        $location.path('#/auth/login');
        $location.replace();
      }
    });


    $scope.fbLogin = function () {
      ngFB.login({scope: 'email'}).then(
        function (response) {
          if (response.status === 'connected') {
            ngFB.api({
              path: '/me',
              params: {fields: 'id,name,email,gender,link,middle_name,first_name,last_name,cover,picture'}
            }).then(
              function (user) {
                $scope.user = user;
              },
              function (error) {
                alert('Facebook error: ' + error.error_description);
              });
            ngFB.api({
              path: '/me/picture',
              params: {
                type: 'normal'
              }
            }).then(
              function (user) {
                $scope.picture = user;
              },
              function (error) {
                alert('Facebook error: ' + error.error_description);
              });
            ;
            console.log('Facebook login succeeded');
          } else {
            alert('Facebook login failed');
          }
        });
    };

  }).controller('LoginCtrl', ['$scope', '$location', '$ionicPopup', 'AuthenticationService', function ($scope, $location, $ionicPopup, AuthenticationService) {
    $scope.user = {};
    $scope.login = function (loginForm) {
      if (loginForm.$valid) {
        AuthenticationService.login($scope.user).success(function (data) {
          console.log(data);
          $location.path("/app/browse");
        }).error(function (error) {
          if (error.errorCode === 1007) {
            $location.path('auth/accountActivation')
          } else {
            var alertPopup = $ionicPopup.alert({
              template: error.resultData.userMsg,
              okType: 'button-balanced'
            });
            alertPopup.then(function (res) {

            });
          }
          console.log(error);
        });
      }
    }
  }]).controller('AccountActivationCtrl', ['$scope', 'AccountService', 'AuthenticationService', '$location', function ($scope, accountService, authenticationService, $location) {
    if (!authenticationService.getPhone()) {
      $location.path('/auth/login');
    } else {
      $scope.activationData = {};
      $scope.activateAccount = function (accountActivationForm) {
        if (accountActivationForm.$valid) {
          accountService.activateAccount(authenticationService.getPhone(), $scope.activationData.activationCode).success(function (data) {
            console.log(data);
            $location.path("/app/browse");
          }).error(function (error) {
            console.log(error);
          });
        }
      }
      $scope.resendActivationCode = function () {
        if (!authenticationService.getPhone()) {
          $location.path('/auth/login');
        }
        accountService.resendActivationCode(authenticationService.getPhone()).success(function (data) {
          console.log(data);
        }).error(function (error) {
          console.log(error);
        });
      }
    }
  }]).controller('ForgotPasswordCtrl', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, AuthenticationService) {
    $scope.user = {};
    $scope.resetPassword = function (forgotPasswordForm) {
      if (forgotPasswordForm.$valid) {
        AuthenticationService.resetPassword($scope.user).success(function (data) {
          console.log(data);
          $location.path("/auth/login");
        }).error(function (error) {
          console.log(error);
        });
      }
    };
  }]).controller('ChangePasswordCtrl', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, AuthenticationService) {
    $scope.user = {};
    $scope.chnagePassword = function (changePasswordForm) {
      if (changePasswordForm.$valid) {
        AuthenticationService.changePassword(AuthenticationService.getPhone(), $scope.user.old_pwd,$scope.user.new_pwd).success(function (data) {
          console.log(data);
          $location.path("/auth/login");
        }).error(function (error) {
          console.log(error);
        });
      }
    };
  }]).directive('confirmPwd', function($interpolate, $parse) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModelCtrl) {

        var pwdToMatch = $parse(attr.confirmPwd);
        var pwdFn = $interpolate(attr.confirmPwd)(scope);

        scope.$watch(pwdFn, function(newVal) {
          ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
        })

        ngModelCtrl.$validators.password = function(modelValue, viewValue) {
          var value = modelValue || viewValue;
          return value == pwdToMatch(scope).$modelValue;
        };

      }
    }
  });;

