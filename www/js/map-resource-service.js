angular
  .module('sftw')
  .factory('mapResource', function mapResourceFactory($http) {

    var NOTIFICATION_BASE_URL = '/lastlocation';
    var HTTP_CONFIG = {
      timeout: 10000
    };

    var getLastLocation = function () {
      return $http.get(
        'http://sftw.be/lastlocation.last.json',
        HTTP_CONFIG
      );
    };

    return {
      getLastLocation: getLastLocation
    };
  });
