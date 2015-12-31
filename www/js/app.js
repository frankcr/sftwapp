angular.module('sftw', ['ionic', 'sftw.controllers', 'sftw.directives', 'sftw.services', 'sftw.resources', 'ngMaterial'])
  //.constant('ApiEndpoint', {
  //  url: 'http://localhost:8100/api'
  //})

  //For the real endpoint, we'd use this
  .constant('ApiEndpoint', {
   url: 'http://sftw.be'
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      if (window.Connection) {
        if (navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
          })
            .then(function (result) {
              if (!result) {
                ionic.Platform.exitApp();
              }
            });
        }
      }
    });

  }).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/components/menu.html",
        controller: 'AppCtrl'
      })

      .state('app.map', {
        url: "/map",
        views: {
          'menuContent': {
            templateUrl: "templates/screens/map.html",
            controller: 'MapCtrl'
          }
        }
      }).state('app.photography', {
        url: "/photography",
        views: {
          'menuContent': {
            templateUrl: "templates/screens/photography.html",
            controller: 'PhotographyCtrl'
          }
        }
      }).state('app.settings', {
        url: "/settings",
        views: {
          'menuContent': {
            templateUrl: "templates/screens/settings.html",
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('app.login', {
        url: "/settings/login",
        views: {
          'menuContent': {
            templateUrl: "templates/screens/login.html",
            controller: 'LoginCtrl'
          }
        }
      });
    //   if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/map');
  });
