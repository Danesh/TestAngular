app.controller("timeController", function($scope, $http, $timeout, $log) {
    $scope.$on("$destroy", function(event) {
        $timeout.cancel($scope.updateTime);
    });
    $scope.$on("$routeChangeStart", function() {
        $timeout.cancel($scope.updateTime);
    });
    var timeInterval = function() {
        var requestTime = Date.now();
        var responsePromise = $http.get(baseUrl + "/api/v1/time");
        responsePromise.success(function(data, status, headers, config) {
            var delta = Date.now() - requestTime;
            $scope.currentTime = data;
            $scope.updateTime = $timeout(timeInterval, Math.min(delta, 1000));
        });
        responsePromise.error(function(data, status, headers, config) {
            logError($log, "Failed to fetch time", data, status, headers, config);
        });
    };
    timeInterval();
});