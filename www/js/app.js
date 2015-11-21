// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('quickRide', ['ionic', 'ionic.contrib.drawer'])

  .run(function ($ionicPlatform) {
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
    $stateProvider

      //Authentication Pages
      .state('auth', {
        abstract: true,
        url: "/auth",
        templateUrl: "templates/auth.html"
      })
      .state('auth.landing', {
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
        templateUrl: "templates/forgotPassword.html"
      })
      .state('auth.accountActivation', {
        url: "/accountActivation",
        templateUrl: "templates/accountActivation.html",
        controller:"AccountActivationCtrl"
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
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
    $urlRouterProvider.otherwise('/auth/landing');
  });
