
angular.module 'JKApp.portfolio'
  .directive 'jkProjectFilter', ->
    scope:
      filters: '='
      activeFilter: '='
    controller: ($scope) ->
      $scope.clearFilter = () ->
        $scope.activeFilter = null
      $scope.toggleFilter = (filter) ->
        if $scope.activeFilter? and filter.name is $scope.activeFilter.name
          $scope.activeFilter = null
          
        else
          $scope.activeFilter = filter
          $scope.activeFilter.selected = []

      $scope.toggleValue = (value) ->
        return if not $scope.activeFilter?
        if $scope.isValueSelected value
          $scope.activeFilter.selected = (v for v in $scope.activeFilter.selected when v != value.name)
        else
          $scope.activeFilter.selected.push value.name
      $scope.isValueSelected = (value) ->
        return true if not $scope.activeFilter?
        value.name in $scope.activeFilter.selected
    replace: true
    templateUrl: 'directives/jk_project_filter.html'
  
  .directive 'jkProjectSorter', ->
    scope:
      sorters: '='
      activeSorter: '='
    controller: ($scope) ->
      $scope.selectSorter = (sorter) ->
        if $scope.activeSorter.name is sorter.name
          $scope.activeSorter.reverse = !$scope.activeSorter.reverse
        else
          sorter.reverse = false
          $scope.activeSorter = sorter
    replace: true
    templateUrl: 'directives/jk_project_sorter.html'
  
  .directive 'jkProject', ->
    scope:
      project: '='
    controller: ($scope) ->
      $scope.opened = false
      $scope.toggle = () ->
        $scope.opened = !$scope.opened
    replace: true
    templateUrl: 'directives/jk_project.html'