angular.module 'JKApp.home'
  .controller 'HomeController', ($scope, $document) ->
    $scope.scrollTopBio = ->
      element = angular.element document.getElementById('bio')
      console.log element
      $document.scrollToElementAnimated element
    

    