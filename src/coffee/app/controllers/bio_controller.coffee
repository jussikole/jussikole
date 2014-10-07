angular.module 'JKApp.bio'
  .controller 'BioController', ($scope, BioService) ->   
    $scope.tiles = []
    $scope.loading = true
    BioService.getBioTiles().then (data) ->
      $scope.tiles = data.data.tiles
      $scope.loading = false
      