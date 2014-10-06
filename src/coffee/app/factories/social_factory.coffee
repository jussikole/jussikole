angular.module 'JKApp.social'
  .factory 'SocialFactory', ->

    class ImageFeed
      constructor: (@items, @width, @active=0) ->
        @n = @items.length
        
        @nSide = 2 # on both sides
        @nLeftSide = 0
        @nRightSide = 0
        @properties = {}
        @breakPoint = 600
    
    
      calculateProperties: =>
        hiddenTotalW = if @width >= @breakPoint then 30 else 0
        activeW = if @width >= @breakPoint then 30 else 50
        sideW = (100 - activeW - hiddenTotalW) / (2 * @nSide)      
        hiddenW = hiddenTotalW / (@n - 2 * @nSide - 1)

        
        @properties =
          active: activeW
          side: sideW
          hidden: hiddenW
        
        spaceLeft = @active
        spaceRight = @n - @active - 1
        @nLeftSide = Math.min spaceLeft, @nSide
        @nRightSide = Math.min spaceRight, @nSide
      
        if @nRightSide < @nSide
          @nLeftSide += @nSide - @nRightSide
      
        if @nLeftSide < @nSide
          @nRightSide += @nSide - @nLeftSide      

          
      getImageWidth: (i) =>
        if i is @active
          @properties.active
        else if i >= @active - @nLeftSide and i <= @active + @nRightSide
          @properties.side
        else
          @properties.hidden

      getImageClass: (i) =>
        if i is @active
          'image image-active'
        else if i >= @active - @nLeftSide and i < @active
          'image image-side image-side-left'
        else if i <= @active + @nRightSide and i > @active
          'image image-side image-side-right'
        else if i < @active - @nLeftSide
          'image image-hidden image-hidden-left'
        else
          'image image-hidden image-hidden-right'
          
        
      loadImage: (element, data) ->
        img = new Image()
        img.src = data.image.url
        d3.select(img).on 'load', ->
          element
            .transition()
            .duration 500
            .style {
              'background-image': "url(#{data.image.url})"
              opacity: 1
            }
        
      update: (active) =>
        oldActive = @active
        @active = active
        @calculateProperties()
        feed = @
        
        @container.selectAll 'div.image p'
          .text ''
        @container.selectAll 'div.image'
          .attr 'class', (d,i) -> feed.getImageClass i
          .transition()
            .duration 500
            .styleTween 'width', (d, i, a) ->
              oldWidth = d.width          
              d.width = "#{feed.getImageWidth i}%"
              d3.interpolate oldWidth, d.width
            .each 'end', (d,i) ->
              d3.select(this).select 'p'
                .text (d) ->
                  if i is feed.active then d.caption else ''

                
              
      resize: (width) =>
        @container.selectAll 'div.image'
          .style 'padding-bottom', (d,i) => "#{@getImageWidth @active}%"
        @width = width
        @update @active
       
      draw: (elementId) =>
        @container = d3.select elementId
          .append 'div'
          .attr 'class', 'image-feed'
       
        @calculateProperties()
        self = @
        enter = @container.selectAll 'div.image'
          .data @items
          .enter()
     
        enter.append 'div'
          .attr 'class', (d,i) => @getImageClass i
          .style {
            'padding-bottom': (d,i) => "#{@getImageWidth @active}%"
            width: (d, i) =>
              d.width = "#{@getImageWidth i}%"
              d.width
            opacity: 0
          }
          .each (d,i) -> self.loadImage d3.select(this), d
          .on 'click', (d,i) => @update i
          .append 'p'
              
        @update @active
    
    
    {
      ImageFeed: ImageFeed   
    }  
        
                 
              
              