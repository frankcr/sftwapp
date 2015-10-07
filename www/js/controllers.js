angular.module('sftw.controllers', [])

  .controller('MapCtrl', function ($scope, $ionicLoading, $http, ApiEndpoint) {
    $scope.mapCreated = function (map) {
      $scope.map = map;
      $scope.markers = [];
      $scope.centerOnLastLocation();
    };

    $scope.centerOnMe = function () {
      if (!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function (pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.loading.hide();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    };

    var HTTP_CONFIG = {
      timeout: 10000
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

      $http.get(ApiEndpoint.url + "/lastlocation/last.json", HTTP_CONFIG)
        .success(function (data) {
          var parts = data[0].Latitude.split(/[^\d\w\.]+/);
          var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
          var parts = data[0].Longitude.split(/[^\d\w\.]+/);
          var lng = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
          latLng = new google.maps.LatLng(lat, lng);
          $scope.map.setCenter(latLng);

          addMarker(latLng);

          $scope.loading.hide();
        })
        .error(function (data) {
          alert("ERROR");
        });
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

    function addMarker(location) {
      var marker = new google.maps.Marker({
        position: location,
        map: $scope.map
      });
      $scope.markers.push(marker);
    }

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
    $scope.deleteMarkers = function() {
      clearMarkers();
      $scope.markers = [];
    }

  });
