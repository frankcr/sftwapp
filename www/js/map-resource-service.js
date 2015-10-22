angular
  .module('sftw.resources', [])
  .factory('mapResource', function mapResourceFactory($http, ApiEndpoint) {

    var HTTP_CONFIG = {
      timeout: 10000
    };

    var getLastLocation = function () {
      return $http.get(
        ApiEndpoint.url + '/lastlocation/last.json?time=' + Date.now(),
        HTTP_CONFIG
      );
    };

    var getDestinations = function () {
      return $http.get(
        ApiEndpoint.url + '/lastlocation/destinations.json?time=' + Date.now(),
        HTTP_CONFIG
      );
    };

    var sendLocation = function (location) {
      var data = {location: {longitude: location.latitude, latitude: location.longitude, title: 'Test sending new app'}};
      return $http.post(
        ApiEndpoint.url + '/whereami',
        JSON.stringify(data),
        HTTP_CONFIG
      );
    };

    var startTrip = function (destination) {
      var data = {destination: destination};
      return $http.post(
        ApiEndpoint.url + '/starttrip',
        JSON.stringify(data),
        HTTP_CONFIG
      );
    };

    return {
      getLastLocation: getLastLocation,
      sendLocation: sendLocation,
      getDestinations: getDestinations,
      startTrip: startTrip
    };
  })
  .factory('photographyResource', function photographyResourceFactory($http, ApiEndpoint) {

    var HTTP_CONFIG = {
      timeout: 10000
    };

    var getPhotoAlbums = function () {
      return $http.get(
        ApiEndpoint.url + '/rest/photography/photoalbums.json?time=' + Date.now(),
        HTTP_CONFIG
      );
    };

    var getAllImages = function () {
      return $http.get(
        ApiEndpoint.url + '/rest/photography/images.json?time=' + Date.now(),
        HTTP_CONFIG
      );
    };

    return {
      getPhotoAlbums: getPhotoAlbums,
      getAllImages: getAllImages
    };
  });

