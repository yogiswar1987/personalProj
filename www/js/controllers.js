angular.module('quickRide')

  .controller('AppCtrl', function ($rootScope,$scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $rootScope.showNavBar = false;
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

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

  .controller('SignUpCtrl', function ($rootScope,$scope, $ionicPopup,AuthenticationService,$location) {

    $rootScope.showNavBar = true;
    $scope.signUpData ={};
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
                AuthenticationService.checkReferralCode($scope.signUpData.promoode).success(function(data){
                  var alertPopup = $ionicPopup.alert({
                    template: data
                  });
                  alertPopup.then(function(res) {
                    console.log('promo code alert closed');
                  });
                }).error(function(error){
                  var alertPopup = $ionicPopup.alert({
                    template: error.resultData.userMsg
                  });
                  alertPopup.then(function(res) {
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

    $scope.signUp = function(){
      AuthenticationService.signUp($scope.signUpData).success(function(data){
        $location.path('auth/accountActivation')
        console.log(data);
      }).error(function(error){
        console.log(error);
      });
    }
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  }).controller('LandingCtrl', function ($scope, $stateParams) {
  }).controller('LoginCtrl', ['$scope', '$location','AuthenticationService', function ($scope, $location,AuthenticationService) {
      $scope.user = {};
      $scope.login = function () {
        AuthenticationService.login($scope.user).success(function (data) {
          console.log(data);
          $location.path("/app/browse");
        }).error(function (error) {
          console.log(error);
        });
      }
  }]).controller('AccountActivationCtrl',['$scope','AccountService','AuthenticationService','$location',function($scope,AccountService,AuthenticationService,$location){

    $scope.activateAccount = function(){
      if(!AuthenticationService.getPhone()){
        $location('/auth/login')
      }
      AccountService.activateAccount(AuthenticationService.getPhone(),$scope.activationCode).success(function(data){
        console.log(data);
      }).error(function(error){
        console.log(error);
      });
    }
  }]);

