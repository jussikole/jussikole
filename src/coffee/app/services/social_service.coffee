
angular.module 'JKApp.social'
  .service 'SocialService', ($http, $q, $timeout) ->
    getInstagramImages: ->
      $http.get '/ig'
      
    getTweets: ->
      deferred = $q.defer()
      
      getTimestamp = (dateStr) ->
        ((new Date(dateStr)).getTime() / 1000).toFixed 0
      
      resolve = ->
        deferred.resolve {
          data:
            tweets: [
              { type: 'text', text: 'first tweet', timestamp: getTimestamp '2014-06-06' }
              { type: 'text', text: 'second tweet', timestamp: getTimestamp '2014-07-06' }
              { type: 'text', text: 'third tweet', timestamp: getTimestamp '2014-08-06' }
              { type: 'text', text: 'fourth tweet', timestamp: getTimestamp '2014-09-04' }
            ]
        }
      $timeout resolve, 2000
      
      deferred.promise
      
    addNewItems: (oldItems, newItems) ->
      oldItems = angular.copy oldItems
      items = oldItems.concat newItems
      
      items = items.sort (a,b) ->
        a.timestamp - b.timestamp
      
      items
      
