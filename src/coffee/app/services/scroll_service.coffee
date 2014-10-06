angular.module 'JKApp.common'
  .service 'ScrollService', ($window)->  
    whenVisible: (element, execOnce, inCallback) ->
      isInside = (top, bottom, height) ->
        (top >= 0 and top <= height) or
          (bottom >= 0 and bottom <= height) or
          (top <= 0 and bottom >= height)
  
      events = 'scroll load'
      angular.element($window).bind events, ->
        elementTop = element[0].getBoundingClientRect().top
        elementBottom = element[0].getBoundingClientRect().bottom
        windowHeight = $window.innerHeight

        if isInside elementTop, elementBottom, windowHeight
          inCallback()
          angular.element($window).unbind events if execOnce