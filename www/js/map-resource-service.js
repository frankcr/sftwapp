angular
  .module('sftw.resources', [])
  .factory('mapResource', function mapResourceFactory($http, ApiEndpoint) {

    var HTTP_CONFIG = {
      timeout: 10000
    };

    var getLastLocation = function () {
      return $http.get(
        ApiEndpoint.url + '/lastlocation/last.json',
        HTTP_CONFIG
      );
    };

    return {
      getLastLocation: getLastLocation
    };
  });
