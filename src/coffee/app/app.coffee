angular.module 'JKApp.common', []
angular.module 'JKApp.home', []
angular.module 'JKApp.travel', []
angular.module 'JKApp.social', []
angular.module 'JKApp.skills', []
angular.module 'JKApp.bio', []
angular.module 'JKApp.portfolio', []

app = angular.module 'JKApp', [
  'JKApp.common'
  'JKApp.home'
  'JKApp.bio'
  'JKApp.social'
  'JKApp.skills'
  'JKApp.travel'
  'JKApp.portfolio'
  'duScroll'
  'angular-parallax'
  'ngRoute'
]

app.config ($routeProvider) ->
  pages = ['home', 'bio', 'travel', 'social', 'skill', 'portfolio']
  r = $routeProvider
  for page in pages
    ctrlName = page.charAt(0).toUpperCase() + page.slice(1)
    r = r.when "/#{page}/", {
      templateUrl: "partials/#{page}.html"
      controller: "#{ctrlName}Controller"
    }
    console.log r
  r.otherwise {
    redirectTo: '/home/'
  }