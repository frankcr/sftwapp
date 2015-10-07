angular.module('sftw', ['ionic', 'sftw.controllers', 'sftw.directives', 'sftw.services', 'sftw.resources'])
  .constant('ApiEndpoint', {
    url: 'http://localhost:8100/api'
  })

   //For the real endpoint, we'd use this
   //.constant('ApiEndpoint', {
   // url: 'http://sftw.be'
   //})

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
          })
            .then(function(result) {
              if(!result) {
                ionic.Platform.exitApp();
              }
            });
        }
      }
    });
  });
