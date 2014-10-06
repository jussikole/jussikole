angular.module 'JKApp.common'
  .directive 'jkScrollLoad', ($window, ScrollService) ->
    replace: false
    link: (scope, element, attrs) ->
      execOnce = attrs.execOnce ? false
      ScrollService.whenVisible element, execOnce, ->
        scope.$apply -> scope.load()
            
  .directive 'jkViewLoader', () ->
    scope:
      text: '@'
    replace: true
    templateUrl: 'directives/jk_view_loader.html'
    
  .directive 'jkLazyBg', ($http) ->
    link: (scope, element, attrs) ->
      path = "../images/#{attrs.jkLazyBg}"
      $http.get(path).then ->
        element.css 'background-image', "url(#{path})"
        element.css 'opacity', '1'
        
  .directive 'jkViewTitle', ->
    scope:
      text: '='
    replace: true
    template: "
      <div class='view-title'>
        <div class='space-1'></div>
        <div class='space-2'><div class='line'></div></div>
        <div class='text' ng-bind='text'></div>  
        <div class='space-2'><div class='line'></div></div>
        <div class='space-1'></div>
      </div>
    "
        
  .directive 'jkFollowScroll', ($window) ->
    link: (scope, element, attrs) ->
      w = angular.element $window
      initialTop = element[0].offsetTop
      
      fixed = w[0].scrollY > initialTop
      
      w.bind 'resize', ->
        initialTop = element[0].offsetTop
      
      w.bind 'scroll load', ->
        windowTop = w[0].scrollY
        console.log windowTop, initialTop
        if windowTop > initialTop
          if !fixed
            element.addClass 'menu-floating'
            element.removeClass 'menu-fixed'
          fixed = true
        else
          if fixed
            element.removeClass 'menu-floating'
            element.addClass 'menu-fixed'
          fixed = false