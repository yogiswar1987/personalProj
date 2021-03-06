// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('quickRide', ['ionic','ionMdInput','ionic-material', 'ngOpenFB','ngMessages','uiGmapgoogle-maps'])

  .run(function ($ionicPlatform, ngFB) {
    ngFB.init({appId: '1524191344558710'});
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


    window.BASE_URL = "http://testrm.getquickride.com:8080/dishaapiserver/rest/";
    $ionicConfigProvider.views.transition("android");
    $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
    $stateProvider

      //Authentication Pages
      .state('auth', {
        abstract: true,
        url: "/auth",
        templateUrl: "templates/auth.html"
      })
      .state('landing', {
        url: "/landing",
        templateUrl: "templates/landing.html",
        controller: "LandingCtrl"
      })
      .state('auth.login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginCtrl"
      })
      .state('auth.signUp', {
        url: "/signUp",
        templateUrl: "templates/signUp.html",
        controller: "SignUpCtrl"
      })
      .state('auth.forgotPassword', {
        url: "/forgotPassword",
        templateUrl: "templates/forgotPassword.html",
        controller: "ForgotPasswordCtrl"
      })
      .state('auth.accountActivation', {
        url: "/accountActivation",
        templateUrl: "templates/accountActivation.html",
        controller: "AccountActivationCtrl"
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })
      .state('app.changePassword', {
        url: '/changePassword',
        views: {
          'menuContent': {
            templateUrl: 'templates/changePassword.html',
            controller: 'ChangePasswordCtrl'
          }
        }
      })
      .state('app.newRide', {
        url: '/newRide',
        views: {
          'menuContent': {
            templateUrl: 'templates/newRide.html',
            controller: 'NewRideCtrl'
          }
        }
      })
      .state('app.ride', {
        url: '/ride',
        views: {
          'menuContent': {
            templateUrl: 'templates/ride.html',
            controller: 'RideCtrl'
          }
        }
      })
      .state('app.ride.offerRide', {
        url: '/offerRide',
        views: {
          'rides': {
            templateUrl: 'templates/offerRide.html',
            controller: 'OfferRideCtrl'
          }
        }
      })
      .state('app.ride.findRide', {
        url: '/findRide',
        views: {
          'rides': {
            templateUrl: 'templates/findRide.html',
            controller: 'FindRideCtrl'
          }
        }
      })
      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/landing');
  });
