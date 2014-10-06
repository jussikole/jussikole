angular.module 'JKApp.portfolio'
  .factory 'PortfolioFactory', () ->
    methods =    
      getProjects: () ->
        [
          {
            name: 'CMS website for an international electricity market'
            technologies: [
              'jasmine'
              'karma'
              'angularjs'
              'episerver'
              'html5'
              'highcharts'
              '.net'
            ]
            description: "
              Official website for an international company. 
              Content management system allows editors to publish news and articles.
              Integration with external data sources for retrieving market data and operational messages.
            "
            type: 'work'
            role: 'Software developer'
            tasks: [
              'Writing backend API methods for retrieving page structures from EPiServer'
              'Creating interactive data representations with Highcharts'
              'Displaying numerical data on custom Highmaps'
              'Implementing dashboard for showing data with AngularJS'
              'Testing front-end with Jasmine and Karma'       
            ]
            url: null
            time:
              format: 'mm/yyyy'
              start: new Date('4-1-2014')
              end: null
          }
          {
            name: "Master's thesis at Aalto University School of Science"
            technologies: [
              'java'
              'cep'
              'hibernate'
              'machine learning'
              'wavelets'
            ]
            description: "
              Master's thesis topic: Predicting Complex Events in Sensor Data.
              I used machine learning techniques to predict events in sensor data.
              Models were tested in practive with so-called intelligent house.
            "
            type: 'school'
            role: 'researcher'
            tasks: [
              'Comprehensive literature review'
              'Developing mathematical theory for predictive analytics'
              'Implementing testing framework with Java and 3rd party libraries'
              'Writing thesis report'
            ]
            time:
              format: 'mm/yyyy'
              start: new Date('2-1-2013')
              end: new Date('6-20-2013')
          }
        ]
    
    
    methods