angular.module 'JKApp.travel'
  .controller 'TravelController', ($scope, TravelFactory) ->
    $scope.places = TravelFactory.getPlaces()