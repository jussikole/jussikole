
angular.module 'JKApp.bio'
  .directive 'jkBioTile', ->
    scope:
      tile: '='
      index: '@'
      
    controller: ($scope) ->

    replace: false
    templateUrl: 'directives/jk_bio_tile.html'