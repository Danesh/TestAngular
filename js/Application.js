var app = angular.module("WidgetsApp", ['ngRoute', 'ngResource']);
app.config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $rootScope, $timeout) {
        return {
            'request': function(config) {
                $rootScope.$broadcast(loadingStartConst);
                return config || $q.when(config);
            },
            'response': function(response) {
                var defer = $q.defer();
                $timeout(function() {
                    $rootScope.$broadcast(loadingCompleteConst);
                    return defer.resolve(response);
                }, delayHttpDuration);
                return defer.promise;
            }
        };
    });
});

app.controller("mainController", function($scope) {
    $scope.$on(loadingStartConst, function(e) {
        $scope.showLoading = true;
    });
    $scope.$on(loadingCompleteConst, function(e) {
        $scope.showLoading = false;
    });

    $scope.tabItems = [
        { index:0, title: "Home", ref:'#', hideWhenLoading: true},
        { index:1, title: "Time", ref:'#/time', hideWhenLoading: false},
        { index:2, title: "Widgets", ref:'#/widgets', hideWhenLoading: true}
    ];

    $scope.isCurrentTab = function(tab) {
        return tab == $scope.currentTab;
    };
    $scope.selectTab = function(tab) {
        $scope.currentTab = tab;
    }

    // Set defaults
    $scope.selectTab($scope.tabItems[0]);
});

var logError = function(logger, message, data, status, headers, config) {
    logger.error("ERROR : " + message);
    logger.error("Data: " + data);
    logger.error("Status: " + status);
    logger.error("Headers: " + headers);
    logger.error("Config: " + JSON.stringify(config));
}

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/time', {
        templateUrl : 'pages/time.html',
        controller: 'timeController'
    })
    .when('/widgets', {
        templateUrl : 'pages/widgets.html',
        controller: 'widgetController'
    })
    .when('/', {
        templateUrl : 'pages/home.html'
    })
    .otherwise({ redirectTo: '/'});
}]);