
angular.module 'JKApp.social'
  .directive 'jkSocialFeed', ($compile, SocialService) ->
    scope:
      items: '='  
    templateUrl: 'directives/jk_social_feed.html'

