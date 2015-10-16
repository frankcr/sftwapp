angular.module('sftw.controllers', [])
  .controller('AppCtrl', function ($scope) {
  })
  .controller('PhotographyCtrl', function ($scope, photographyResource) {

    var initialize = function () {
      photographyResource.getPhotoAlbums().success(function (data) {
        $scope.albums = data;
        console.log(data);
      }).error(function (data) {
        console.log(data);
      });
    };
    initialize();

  })
  .controller('SettingsCtrl', function ($scope) {
  })
  .controller('MapCtrl', function ($scope, $ionicLoading, $http, $interval, mapResource, $ionicSideMenuDelegate) {

    var isLocating = false;
    var id;
    var lastSent = 0;
    var lastSuccessfulLocationSent = 0;
    var lastSuccessfulDestinationsGet = 0;
    var lastSuccessfulLocationGet = 0;
    var ONEMINUTE = 60 * 1000;
    var TENSECONDS = 60 * 1000;
    var TWOMINUTES = 2 * ONEMINUTE;
    var FIVEMINUTES = 5 * ONEMINUTE;
    var ONEHOUR = 60 * ONEMINUTE;
    var ONEDAY = 24 * ONEHOUR;


    $scope.initializeMap = function (map) {
      initializeWithDefaults(map);
      initializeFromLocalStorage();
      initializeFromWebservices();
    };

    var initializeWithDefaults = function (map) {
      $scope.map = map;
      $scope.markers = [];
    };

    var initializeFromLocalStorage = function () {
      lastSuccessfulLocationSent = getLastSuccessfulLocationSentFromLocalStorage();
      lastSuccessfulLocationGet = getLastSuccessfulLocationGetFromLocalStorage();
      lastSuccessfulDestinationsGet = getLastSuccessfulDestinationGetFromLocalStorage();
      $scope.centerOnLastLocationFromLocalStorage();
    };

    var getLastSuccessfulDestinationGetFromLocalStorage = function () {
      return getFromLocalStorage('LASTSUCCESSFULLDESTINATIONSGET', 0);
    };

    var getDestinationsFromLocalStorage = function () {
      return getFromLocalStorage('DESTINATIONS', []);
    };

    var getLastSuccessfulLocationGetFromLocalStorage = function () {
      return getFromLocalStorage('LASTSUCCESSFULLLOCATIONGET', 0);
    };

    var initializeFromWebservices = function () {
      $scope.centerOnLastLocation();
      $interval(function () {
        $scope.centerOnLastLocation();
      }, 120000);
    };

    var getLastSuccessfulLocationSentFromLocalStorage = function () {
      return getFromLocalStorage('LASTSUCCESSFULLOCATIONSENT', 0);
    };

    var getLastLocationFromLocalStorage = function () {
      return getFromLocalStorage('LASTLOCATION', {Latitude: "0° 0' 0 N", Longitude: "0° 0' 0 E", Titel: "", Label: ""});
    };

    var addToLocalStorage = function (key, value) {
      window.localStorage['SFTW-' + key] = JSON.stringify(value);
    };

    //TODO create service for this:
    //http://learn.ionicframework.com/formulas/localstorage/
    var getFromLocalStorage = function (key, defaultValue) {
      return JSON.parse(window.localStorage['SFTW-' + key] || JSON.stringify(defaultValue));
    };

    $scope.centerOnLastLocationFromLocalStorage = function () {
      if (!$scope.map) {
        return;
      }

      $scope.deleteMarkers();


      var location = getLastLocationFromLocalStorage();


      $scope.map.setCenter(getLatLngFromLocation(location));
      addMarker(location, 'red');
    };
    $scope.centerOnLastLocation = function () {
      if (!$scope.map) {
        return;
      }

      $scope.deleteMarkers();

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      getDestinations();
      getLastLocation();
    };

    var getLastLocation = function () {
      mapResource.getLastLocation()
        .success(function (data) {
          var location = data[0];

          addToLocalStorage('LASTLOCATION', location);
          addToLocalStorage('LASTSUCCESSFULLLOCATIONGET', getCurrentTimestamp());
          lastSuccessfulLocationGet = getCurrentTimestamp();

          $scope.map.setCenter(getLatLngFromLocation(location));
          addMarker(location, 'red');

          $scope.loading.hide();
        })
        .error(function (data) {
          alert("Cannot get last location, please try again later");
        });
    };

    var getDestinations = function () {
      if (getCurrentTimestamp() - getLastSuccessfulDestinationsGet() > ONEDAY) {
        mapResource.getDestinations()
          .success(function (destinations) {
            addToLocalStorage('DESTINATIONS', destinations);
            addToLocalStorage('LASTSUCCESSFULLDESTINATIONSGET', getCurrentTimestamp());
            lastSuccessfulDestinationsGet = getCurrentTimestamp();
            destinations.forEach(function (destination) {
              addMarker(destination, 'blue');
            });

          })
          .error(function (data) {
            alert("Cannot get destinations, please try again later");
          });
      } else {
        var destinations = getDestinationsFromLocalStorage();
        destinations.forEach(function (destination) {
          addMarker(destination, 'blue');
        });
      }
      $scope.loading.hide();

    };


    function ConvertDMSToDD(degrees, minutes, seconds, direction) {
      degrees = parseInt(degrees);
      minutes = parseInt(minutes);
      seconds = parseFloat(seconds);
      var minutesPart = minutes / 60;
      var secondsPart = seconds / (60 * 60);
      var dd = degrees + minutesPart + secondsPart;

      if (direction == "S" || direction == "W") {
        dd = dd * -1;
      } // Don't do anything for N or E
      return dd;
    }

    function addMarker(location, color) {

      latLng = getLatLngFromLocation(location);
      var marker = new google.maps.Marker({
        position: latLng,
        map: $scope.map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png'
      });
      $scope.markers.push(marker);
    }

    var getLatLngFromLocation = function (location) {
      var parts = location.Latitude.split(/[^\d\w\.]+/);
      var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
      parts = location.Longitude.split(/[^\d\w\.]+/);
      var lng = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
      return new google.maps.LatLng(lat, lng);
    };

// Sets the map on all markers in the array.
    function setMapOnAll(map) {
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setMap(map);
      }
    }

// Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setMapOnAll(null);
    }

// Shows any markers currently in the array.
    function showMarkers() {
      setMapOnAll(map);
    }

// Deletes all markers in the array by removing references to them.
    $scope.deleteMarkers = function () {
      clearMarkers();
      $scope.markers = [];
    };

    $scope.startLocating = function () {
      //cordova.plugins.backgroundMode.enable();
      lastSent = 0;
      isLocating = true;
      console.log('test start location');
      id = navigator.geolocation.watchPosition(function (location) {/*success*/
        if (getCurrentTimestamp() - lastSent > ONEMINUTE) {
          lastSent = new Date().getTime();

          mapResource.sendLocation(location.coords).success(function (respons) {
            console.log('success');
            lastSuccessfulLocationSent = getCurrentTimestamp();
            addToLocalStorage('LASTSUCCESSFULLOCATIONSENT', getLastSuccessfulLocationSent());
            lastSent = getCurrentTimestamp();
          }).error(function (error) {
            lastSent = getLastSuccessfulLocationSent();
          });
        }

      }, function (errorMessage) {/*error*/
        console.log(errorMessage);
      }, null);

    };

    $scope.stopLocating = function () {
      //cordova.plugins.backgroundMode.disable();
      navigator.geolocation.clearWatch(id);
      isLocating = false;
    };

    $scope.isLocating = function () {
      return isLocating;
    };

    var getCurrentTimestamp = function () {
      return new Date().getTime();
    };

    var getLastSuccessfulLocationSent = function () {
      return lastSuccessfulLocationSent;
    };

    var getLastSuccessfulDestinationsGet = function () {
      return lastSuccessfulDestinationsGet;
    };

    var getLastSuccessfulLocationGet = function () {
      return lastSuccessfulLocationGet;
    };

    $scope.getLastSuccessfulLocationSentDate = function () {
      return formatTimeStamp(getLastSuccessfulLocationSent());
    };

    $scope.getLastSuccessfulDestionationsGetDate = function () {
      return formatTimeStamp(getLastSuccessfulDestinationsGet());
    };

    $scope.getLastSuccessfulLocationGetDate = function () {
      return formatTimeStamp(getLastSuccessfulLocationGet());
    };

    var formatTimeStamp = function (timeStamp) {
      if (timeStamp === 0) {
        return 'never';
      }
      var dateObject = new Date(timeStamp);
      return dateObject.getDate() + '/' + (dateObject.getMonth() + 1) + '/' + dateObject.getFullYear() + ' ' +
        dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    };

    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

  })
;
