angular.module 'JKApp.social'
  .controller 'SocialController', ($scope, $window, SocialService, SocialFactory) ->
    
    load = ->
      SocialService.getInstagramImages().then (response) ->
        instagramFeed = new SocialFactory.ImageFeed response.data.medias, $window.innerWidth
        angular.element(document.getElementById('instagram-feed')).empty()
        instagramFeed.draw '#instagram-feed'
        
        angular.element($window).on 'resize', ->
          instagramFeed.resize $window.innerWidth
          
    load()
        
    

    