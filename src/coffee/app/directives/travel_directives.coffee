angular.module 'JKApp.travel'
  .directive 'jkMap', ($window, $timeout, TravelFactory) ->
    scope:
      items: '='
      
    controller: ($scope, $element) ->
      map = null
      
      getSize = ->
        element = angular.element $element
        w = element[0].offsetWidth
        h = w / 1.4
        { width: w, height: h }
      
      draw = ->
        map = new TravelFactory.JKMap '#map-container', '/json/world-110m.json', getSize()
        map.draw()
      
      
      resizePromise = null
      angular.element($window).bind 'resize', ->
        $timeout.cancel resizePromise if resizePromise?
        
        
        resizePromise = $timeout(
          -> map.resize getSize(),
          1000
        )
        
      draw()
    
    templateUrl: 'directives/jk_map.html'
    
  .filter 'leftSidePlaces', ->
    (places) -> places[0..places.length / 2 - 1]
    
  .filter 'rightSidePlaces', ->
    (places) -> places[places.length / 2..places.length - 1 - (places.length % 2)]
      