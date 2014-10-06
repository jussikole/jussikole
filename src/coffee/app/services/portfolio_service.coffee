angular.module 'JKApp.portfolio'
  .service 'PortfolioService', (PortfolioFactory) ->
    methods =
      getProjects: ->
        # Todo: move to backend
        PortfolioFactory.getProjects()
      
      getFilters: (projects) -> [
        {
          name: 'filter by topics'
          values: methods.parseTechnologies projects
          selected: []
          isVisible: (project) ->
            (t for t in project.technologies when t in this.selected).length > 0
        }
        {
          name: 'filter by type'
          values: methods.parseProjectTypes projects
          selected: []
          isVisible: (project) ->
            project.type in this.selected
        }
      ]
  
      getSorters: -> [
        {
          name: 'sort by time'
          sortFunction: (p1, p2) ->
            if p1.time.start == p2.time.start
              p1.time.end - p2.time.end
            else
              p1.time.start - p2.time.start
          reverse: false
        }
        {
          name: 'sort alphabetically'
          sortFunction: (p1, p2) ->
            if p1.name < p2.name
              -1
            else if p1.name > p2.name
              1
            else
              0
          reverse: false
        }
        #{
        #  name: 'random'
        #  getSortFunction: () ->
        #    random = Math.random()
        #    (p1, p2) ->
        #      if this.dir * random > 0.5 then -1 else 1
        #}
      ]
    
      sortFilterValues: (obj) ->
        (obj[key] for key in Object.keys obj)
          .sort (t1, t2) ->
            if t1.name < t2.name
              -1
            else if t1.name > t2.name
              1
            else 0
  
      parseTechnologies: (projects) -> 
        technologies = {}
        for project in projects
          for technology in project.technologies
            if technology of technologies
              technologies[technology].count++
            else
              technologies[technology] =
                name: technology
                count: 1           
        methods.sortFilterValues technologies
  
      parseProjectTypes: (projects) -> 
        projectTypes = {}
        for project in projects
          if project.type of projectTypes
            projectTypes[project.type].count++
          else
            projectTypes[project.type] =
              name: project.type
              count: 1
        methods.sortFilterValues projectTypes
      
    methods