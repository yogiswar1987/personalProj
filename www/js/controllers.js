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
    $scope.male = true;
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
                    template: data,
                    buttons: [
                      {
                        text: '<b>Ok</b>',
                        type: 'button-balanced'
                      }]
                  });
                  alertPopup.then(function (res) {
                    console.log('promo code alert closed');
                  });
                }).error(function (error) {
                  var alertPopup = $ionicPopup.alert({
                    template: error.resultData.userMsg,
                    buttons: [
                      {
                        text: '<b>Ok</b>',
                        type: 'button-balanced'
                      }]
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
  }).controller('LandingCtrl', function ($scope, $ionicModal, $timeout, ngFB, AuthenticationService, $location, $rootScope, ionicMaterialInk, ionicMaterialMotion) {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
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

  }).controller('LoginCtrl', ['$scope', '$location', '$ionicPopup', 'AuthenticationService', 'ionicMaterialInk', 'ionicMaterialMotion', function ($scope, $location, $ionicPopup, AuthenticationService, ionicMaterialInk, ionicMaterialMotion) {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

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
  }]).controller('ForgotPasswordCtrl', ['$scope', '$location', 'AuthenticationService', '$ionicPopup', function ($scope, $location, authenticationService, $ionicPopup) {
    $scope.user = {};
    $scope.resetPassword = function (forgotPasswordForm) {
      if (forgotPasswordForm.$valid) {
        authenticationService.resetPassword($scope.user).success(function (data) {
          console.log(data);
          var alertPopup = $ionicPopup.alert({
            template: "New password for Quickride has sent to your registered mobile number",
            okType: 'button-balanced'
          });
          alertPopup.then(function (res) {
            $location.path("/auth/login");
          });

        }).error(function (error) {
          var alertPopup = $ionicPopup.alert({
            template: error.resultData.userMsg,
            okType: 'button-balanced'
          });
          alertPopup.then(function (res) {

          });

          console.log(error);
        });
      }
    };
  }]).controller('ChangePasswordCtrl', ['$scope', '$location', 'AccountService', 'AuthenticationService', function ($scope, $location, accountService, authenticationService) {
    $scope.user = {};
    $scope.changePassword = function (changePasswordForm) {
      if (changePasswordForm.$valid) {
        accountService.changePassword(authenticationService.getPhone(), $scope.user.old_pwd, $scope.user.new_pwd).success(function (data) {
          console.log(data);
          $scope.user.old_pwd = '';
          $scope.user.new_pwd = '';
        }).error(function (error) {
          console.log(error);
        });
      }
    };
  }]).directive('confirmPwd', function ($interpolate, $parse) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attr, ngModelCtrl) {

        var pwdToMatch = $parse(attr.confirmPwd);
        var pwdFn = $interpolate(attr.confirmPwd)(scope);

        scope.$watch(pwdFn, function (newVal) {
          ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
        })

        ngModelCtrl.$validators.password = function (modelValue, viewValue) {
          var value = modelValue || viewValue;
          return value == pwdToMatch(scope).$modelValue;
        };

      }
    }
  }).controller('NewRideCtrl', ['$scope', 'ionicMaterialInk', 'ionicMaterialMotion', function ($scope, ionicMaterialInk, ionicMaterialMotion) {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
    var myLatlng = new google.maps.LatLng(12.9715987, 77.5945627);

    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"),
      mapOptions);
    navigator.geolocation.getCurrentPosition(function (pos) {
      var myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(myLatLng);
      $scope.map.setZoom(16);
      var circle = new google.maps.Circle({
        center: myLatLng,
        radius: pos.coords.accuracy,
        map: $scope.map,
        fillColor: '#ABD8E6',
        fillOpacity: 0.5,
        strokeColor: '#ABD8E6',
        strokeOpacity: 1.0
      });
      var circle1 = new google.maps.Circle({
        center: myLatLng,
        radius: 1,
        map: $scope.map,
        fillColor: '#00BDFE',
        fillOpacity: 1.0,
        strokeColor: '#00BDFE',
        strokeOpacity: 1.0
      });
      var marker = new google.maps.Marker({
        position: myLatLng,
        draggable: true,
        animation: google.maps.Animation.DROP,
        map: $scope.map,
        title: 'Hello World!'
      });

      google.maps.event.addListener(marker, 'dragend', function () {
        geocodePosition(marker.getPosition());
      });
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
    function geocodePosition(pos) {
      geocoder = new google.maps.Geocoder();
      geocoder.geocode
      ({
          latLng: pos
        },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(results[0].formatted_address);
          }
          else {
            console.log('Cannot determine address at this location.' + status);
          }
        }
      );
    }
  }])
  .controller('RideCtrl', ['$scope', 'ionicMaterialInk', 'ionicMaterialMotion', function ($scope, ionicMaterialInk, ionicMaterialMotion) {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
    /*   var myLatlng = new google.maps.LatLng(12.9715987, 77.5945627);

     var mapOptions = {
     center: myLatlng,
     zoom: 12,
     disableDefaultUI: true,
     mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     $scope.map = new google.maps.Map(document.getElementById("map"),
     mapOptions);
     navigator.geolocation.getCurrentPosition(function (pos) {
     var myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
     $scope.map.setCenter(myLatLng);
     $scope.map.setZoom(16);
     var circle = new google.maps.Circle({
     center: myLatLng,
     radius: pos.coords.accuracy,
     map: $scope.map,
     fillColor: '#ABD8E6',
     fillOpacity: 0.5,
     strokeColor: '#ABD8E6',
     strokeOpacity: 1.0
     });
     var circle1 = new google.maps.Circle({
     center: myLatLng,
     radius: 1,
     map: $scope.map,
     fillColor: '#00BDFE',
     fillOpacity: 1.0,
     strokeColor: '#00BDFE',
     strokeOpacity: 1.0
     });
     var marker = new google.maps.Marker({
     position: myLatLng,
     draggable: true,
     animation: google.maps.Animation.DROP,
     map: $scope.map,
     title: 'Hello World!'
     });

     google.maps.event.addListener(marker, 'dragend', function () {
     geocodePosition(marker.getPosition());
     });
     }, function (error) {
     alert('Unable to get location: ' + error.message);
     });
     function geocodePosition(pos) {
     geocoder = new google.maps.Geocoder();
     geocoder.geocode
     ({
     latLng: pos
     },
     function (results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
     console.log(results[0].formatted_address);
     }
     else {
     console.log('Cannot determine address at this location.' + status);
     }
     }
     );
     }*/
  }]).controller('OfferRideCtrl', ['$scope', 'ionicMaterialInk', 'ionicMaterialMotion', 'RideManagementService', 'AuthenticationService', 'ProfileService', function ($scope, ionicMaterialInk, ionicMaterialMotion, rideManagementService, authenticationService, profileService) {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
    profileService.getVehicle(authenticationService.getPhone()).success(function (data) {
      $scope.vehicle = data.resultData;
    }).error(function(data){
      console.log(data);
    });
    $scope.from = new google.maps.places.Autocomplete(document.getElementById('from'));
    google.maps.event.addListener($scope.from, 'place_changed', function () {
      var place = $scope.from.getPlace();
      place.formatted_address;
      place.geometry.location.lat();
      place.geometry.location.lng();
    });
    $scope.to = new google.maps.places.Autocomplete(document.getElementById('to'));
    google.maps.event.addListener($scope.to, 'place_changed', function () {
      var place = $scope.to.getPlace();
      place.formatted_address;
      place.geometry.location.lat();
      place.geometry.location.lng();
    });

    $scope.offerRide = function () {
      if ($scope.from.getPlace().geometry && $scope.to.getPlace().geometry) {
        rideManagementService.createRide(authenticationService.getPhone(), $scope.from.getPlace().formatted_address, $scope.from.getPlace().geometry.location.lat(), $scope.from.getPlace().geometry.location.lng(), $scope.to.getPlace().formatted_address, $scope.to.getPlace().geometry.location.lat(), $scope.to.getPlace().geometry.location.lng(), $scope.vehicle.fare, $scope.vehicle.capacity, $scope.vehicle.model, new Date()).success(function (data) {
          console.log(data);
        }).error(function (data) {
          console.log(data);
        });
      }
    };
  }]).controller('FindRideCtrl', ['$scope', 'ionicMaterialInk', 'ionicMaterialMotion', function ($scope, ionicMaterialInk, ionicMaterialMotion) {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
  }]);

