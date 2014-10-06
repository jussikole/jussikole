

angular.module 'JKApp.portfolio'

  .filter 'filterProjects', ->
    (projects, filter) ->
      return projects if not filter?
      projects.filter (project) -> filter.isVisible project


  .filter 'sortProjects', ->
    (projects, sorter) ->
      return projects if not sorter?
      projects.sort sorter.sortFunction
      projects = projects.reverse() if sorter.reverse
      projects
      


  .filter 'projectTimeFormat', ->
    (time) ->
      format = (date) ->
        month = date.getMonth()
        month = if month < 10 then "0#{month}" else month
        "#{month}/#{date.getFullYear()}"
      str = "#{format time.start} -"
      str += " #{format time.end}" if time.end?
      str