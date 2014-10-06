angular.module 'JKApp.travel'
  .factory 'TravelFactory', ($timeout) ->
    
    getPlaces = ->
      [
        { id: 0, name: 'Pieni Kaijansaari, Kuopio, Finland', location:[62.892500, 27.678333], description: "My family's summer cottage on a small island. Amazing sunsets in the summer time." }
        { id: 1, name: 'Victoria Peak, Hong Kong', location: [22.396428, 114.109497], description: "The best sunset I've ever seen. Hint: take a taxi to the top instead of queueing to the cable car." }
        { id: 2, name: 'Kangaroo Point, Brisbane, Australia', location: [-27.471011, 153.023449], description: 'My Australian home during the exchange studies. I really miss the dinners on our big balcony.' }
        { id: 3, name: 'Great Barrier Reef, Australia', location: [-18.286130, 147.700008], description: 'One of the highlights in Australia. The underwater wild life here is really varied and impressive.' }
        { id: 4, name: 'Milford Sound, New Zealand', location: [-44.671625, 167.925621], description: 'The land of the Hobbit at its best. Steep mountains full of waterfalls made me not believe my eyes.' }
        { id: 5, name: 'Bergen, Norway', location: [60.391263, 5.322054], description: "The city between the seven mountains. The view in the city is great." }
        { id: 6, name: 'Alcatraz, San Francisco, USA', location: [37.826977, -122.422956], description: 'Despite the tourist crowds, the atmosphere here is unique.' }
        { id: 7, name: 'Hvar, Croatia', location: [43.172948, 16.441114], description: 'We stopped here for one day during an island hopping cruise. This island has stunning nature' }
        { id: 8, name: 'Wall Street, New York, USA', location: [40.706001, -74.008819], description: 'Description' }
      ]
    
    
    getCurrentCountry = ->
      246
    
    getVisitedCountries = ->
      [
        36,40,84,
        188,191,196,
        203,208,222,233,242,246,248,250,276,292,
        300,320,336,340,344,348,356,380,
        428,484,
        516,554,558,578,
        616,620,630,
        724,752,756,764,784,788,792,
        840
      ]
    
    class JKMap
      constructor: (@containerId, @jsonPath, @initialSize) ->

        @data =
          currentCountry: getCurrentCountry()
          visitedCountries: getVisitedCountries()
          places: getPlaces().map (place) ->
            {
              id: place.id
              name: place.name
              type: 'Point'
              radius: 5
              coordinates: [place.location[1], place.location[0]]
              description: place.description
            }
          currentPlaceIndex: 0
          
        @places =
          title: 35
          gutter: 5
          body: 50
          activeMargin: 0
          border: 1
          
        @transitionDuration = 1500
          

      getCountryClass: (country) =>
        if country.id is @data.currentCountry
          'country country-current'
        else if country.id in @data.visitedCountries
          'country country-visited'
        else
          'country'
          
          
      getPlaceClass: (place) =>
        if place.id is @data.currentPlaceIndex
          'place active'
        else
          'place'
          
      createPath: ->
        @projection = d3.geo.orthographic()
          .scale @size.width / 3
          .translate [@size.width / 2, @size.height / 2]
          .clipAngle 90
        
        @path = d3.geo.path()
          .projection @projection
          .pointRadius (d) -> d.radius
          
      getPlaceTop: (place) =>
        place.id * (@places.title + @places.gutter)

      draw: () =>
        @size = @initialSize
        @createPath()

        @svg = d3.select @containerId
          .append 'svg'
            .attr 'width', @size.width
            .attr 'height', @size.height
              
        body = d3.select 'body'
        
        @sphere = @svg.append 'path'
          .attr 'class', 'sphere'
          .datum { type: 'Sphere' }
          .attr 'd', @path
          
        @gCountries = @svg
          .append 'g'
          .attr 'class', 'countries'
            
        @gPlaces = @svg
          .append 'g'
          .attr 'class', 'places'
            
        divSelectedPlace = body.select '#travel-places'
          .append 'div'
            .attr 'class', 'selected-place'
              
        @divSelectedPlaceTitle = divSelectedPlace
          .append 'div'
            .attr 'class', 'selected-place-title'
        @divSelectedPlaceText = divSelectedPlace
          .append 'div'
            .attr 'class', 'selected-place-text'
              
        @divPlaces = body.select '#travel-places'
          .append 'div'
            .attr 'class', 'travel-places-inner'
            

            
            

           
        @placeLine = null
      
        d3.json @jsonPath, (err, world) =>
          
          @gCountries.selectAll 'path.country'
            .data topojson.feature(world, world.objects.countries).features
            .enter()
              .append 'path'
                .attr 'class', (country) => @getCountryClass country
                .attr 'd', @path
                

          @gPlaces.selectAll 'path.place'
            .data @data.places
            .enter()
              .append 'path'
              .attr 'class', (place) => @getPlaceClass place
              .attr 'd', @path
              .on 'click', (place) =>
                @rotateToPlace place.id
              
          divs = @divPlaces.selectAll 'div.place'
            .data @data.places
            .enter()
            .append 'div'
              .attr 'class', 'place'
            .append 'a'
              .attr 'href', '#/travel'
              .text (p) -> p.name
            .on 'click', (place) =>
              @rotateToPlace place.id
              

                
          i = 0
          nextPlace = =>
            @rotateToPlace @data.places[i]
            i = (i+1) % @data.places.length
            $timeout nextPlace, 10000
                 
          #nextPlace()
          
          @rotateToPlace @data.currentPlaceIndex
           
      rotateToPlace: (placeIndex) =>
        place = @data.places[placeIndex]
        @data.currentPlaceIndex = placeIndex
        @divSelectedPlaceTitle.text place.name
        @divSelectedPlaceText.text place.description
        p.radius = 5 for p in @data.places
        place.radius = 10
        @rotate place.coordinates
            
      rotate: (coordinates) =>
        @placeLine.remove() if @placeLine?
        x1 = @size.width / 2
        y1 = @size.height / 2
        x2 = @size.width - @places.activeMargin
        y2 = 20
        @placeLine = @svg.append 'line'
          .attr 'x1', x2
          .attr 'y1', y2
          .attr 'x2', x2
          .attr 'y2', y2
          .attr 'stroke-width', 4
          .attr 'stroke', '#E36532'
        d3.transition()
          .duration @transitionDuration
          .tween 'rotate', =>
            r = d3.interpolate @projection.rotate(), [-coordinates[0], -coordinates[1]]
            x = d3.interpolateNumber x2, x1
            y = d3.interpolateNumber y2, y1
            (t) =>
              @projection.rotate r(t)
              @placeLine
                .attr 'x1', x(t)
                .attr 'y1', y(t)
              @updateMap()
          
        
      updateMap: () =>
        @sphere
          .attr 'd', @path
        
        @gCountries.selectAll 'path.country'
          .attr 'd', (o) => @path(o) || 'M0,0'
        @gPlaces.selectAll 'path.place'
          .attr 'd', (o) => @path(o) || 'M0,0'
              
        @divPlaces.selectAll 'div.place'
          .attr 'class', (place) => @getPlaceClass place
            
            
              
      resize: (size) =>        
        @size = size
        @createPath()
        @svg
          .attr 'width', size.width
          .attr 'height', size.height
        @rotateToPlace @data.currentPlaceIndex
          

    {
      JKMap: JKMap
      getPlaces: getPlaces
    }
      