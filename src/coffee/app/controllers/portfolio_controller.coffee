angular.module 'JKApp.portfolio'
  .controller 'PortfolioController', ($scope, PortfolioService) ->
    $scope.projects = PortfolioService.getProjects()
    $scope.filters = PortfolioService.getFilters $scope.projects
    $scope.activeFilter = null
    $scope.sorters = PortfolioService.getSorters $scope.projects
    $scope.activeSorter = $scope.sorters[0]