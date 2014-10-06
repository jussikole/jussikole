angular.module 'JKApp.bio'
  .service 'BioService', ($http) -> {
    getBioTiles: ->
      $http.get '/bio'
  }