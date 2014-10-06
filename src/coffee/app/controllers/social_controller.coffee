angular.module 'JKApp.social'
  .controller 'SocialController', ($scope, $window, SocialService, SocialFactory) ->
    
    load = ->
      console.log 'asd'
      SocialService.getInstagramImages().then (response) ->
        instagramFeed = new SocialFactory.ImageFeed response.data.medias, $window.innerWidth
        instagramFeed.draw '#instagram-feed'
        
        angular.element($window).on 'resize', ->
          instagramFeed.resize $window.innerWidth
        
    load()
    

    