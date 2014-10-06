angular.module 'JKApp.bio'
  .controller 'BioController', ($scope, BioService) ->   
    $scope.tiles = []
    $scope.loading = false
    $scope.loaded = false
      
    $scope.load = ->
      return if $scope.loaded
      $scope.loading = true
      BioService.getBioTiles().then (data) ->
        $scope.tiles = data.data.tiles
        $scope.loading = false
        $scope.loaded = true
      