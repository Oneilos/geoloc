var app = angular.module("MyApp", []);

app.factory("GeolocationService", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
    return function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function() {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function() {
                    deferred.resolve(position);
                });
            }, function (error) {
                $rootScope.$apply(function() {
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    }
}]);

app.controller('MainCtrl', ['$scope', '$interval', 'GeolocationService', function ($scope, $interval, geolocation) {
    $scope.position = null;
    $scope.message = "Determining gelocation...";
    
    updateInterval = $interval(function() {
        geolocation().then(function (position) {
            $scope.position = position;
            myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter( myPos );
            marker.setPosition( myPos );
        }, function (reason) {
            $scope.message = "Could not be determined."
        });
    }, 1000);
}]);

function initialize() {
    // Create the map.
    map = new google.maps.Map(document.getElementById('map-canvas'),{
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });    
    marker = new google.maps.Marker({
        map: map,
        title: 'Vous êtes ici',
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
