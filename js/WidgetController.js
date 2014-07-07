app.controller("widgetController", function($scope, $http, $timeout, $log) {
    var setWidgets = function(widgets) {
        $scope.allWidgets = widgets;
        $scope.hasWidgets = widgets != 'undefined' && widgets.length > 0
    };
    $scope.submit = function() {
        $http({
            url: baseUrl + '/widgets/add',
            method: "POST",
            data: {widgetName: $scope.widgetName},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            setWidgets(data);
        }).error(function (data, status, headers, config) {
            logError($log, "Failed to add new widget", data, status, headers, config);
        });
        $scope.widgetName = '';
        $scope.widgetsForm.$setPristine();
    };
    var fetchWidgets = function() {
        var responsePromise = $http.get(baseUrl + "/widgets");
        responsePromise.success(function(data, status, headers, config) {
            setWidgets(data);
        });
        responsePromise.error(function(data, status, headers, config) {
            logError($log, "Failed to fetch widgets", data, status, headers, config);
        });
    };
    fetchWidgets();
});