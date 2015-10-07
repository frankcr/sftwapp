angular
  .module('sftw.services', [])
  .factory('ClockService', function ($interval) {
    var clock = null;
    var service = {
      startClock: function (fn) {
        if (clock === null) {
          clock = $interval(fn, 5000);
        }
      },
      stopClock: function () {
        if (clock !== null) {
          $interval.cancel(clock);
          clock = null;
        }
      }
    };

    return service;
  });
