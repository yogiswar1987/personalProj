angular.module('quickRide')

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

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

  .controller('SignUpCtrl', function ($scope, $ionicPopup,SignUpService) {

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
                SignUpService.checkReferralCode($scope.signUpData.promoode).success(function(data){
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
      SignUpService.signUp($scope.signUpData).success(function(data){
        console.log(data);
      }).error(function(error){
        console.log(error);
      });
    }
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  }).controller('LandingCtrl', function ($scope, $stateParams) {
  }).controller('LoginCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.authenticate = function (loginForm) {

      $scope.errorMessage = "";
      if ($scope.isFormValid(loginForm)) {
        /*authenticationService.authenticate(loginForm.emailId.$modelValue, loginForm.password.$modelValue).success(function (response) {
         $location.path('/app/home');
         }).error(function (response) {
         console.log('authentication failure' + response);
         vm.errorMessage = response.userDisplayErrorStr;
         });*/
      }

      // Quirk to remove .sidebar-visible from body
      // angular.element('body').removeClass('sidebar-visible');
    }
  }]).controller('AccountActivationCtrl',['$scope','AccountService',function($scope,AccountService){

    $scope.activateAccount = function(){
      AccountService.activateAccount($scope.activationCode).success(function(data){
        console.log(data);
      }).error(function(error){
        console.log(error);
      });
    }
  }]);

