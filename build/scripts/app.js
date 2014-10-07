var app;

angular.module('JKApp.common', []);

angular.module('JKApp.home', []);

angular.module('JKApp.travel', []);

angular.module('JKApp.social', []);

angular.module('JKApp.skills', []);

angular.module('JKApp.bio', []);

angular.module('JKApp.portfolio', []);

app = angular.module('JKApp', ['JKApp.common', 'JKApp.home', 'JKApp.bio', 'JKApp.social', 'JKApp.skills', 'JKApp.travel', 'JKApp.portfolio', 'duScroll', 'angular-parallax', 'ngRoute']);

app.config(function($routeProvider) {
  var ctrlName, page, pages, r, _i, _len;
  pages = ['home', 'bio', 'travel', 'social', 'skill', 'portfolio'];
  r = $routeProvider;
  for (_i = 0, _len = pages.length; _i < _len; _i++) {
    page = pages[_i];
    ctrlName = page.charAt(0).toUpperCase() + page.slice(1);
    r = r.when("/" + page + "/", {
      templateUrl: "partials/" + page + ".html",
      controller: "" + ctrlName + "Controller"
    });
    console.log(r);
  }
  return r.otherwise({
    redirectTo: '/home/'
  });
});

angular.module('JKApp.bio').controller('BioController', function($scope, BioService) {
  $scope.tiles = [];
  $scope.loading = true;
  return BioService.getBioTiles().then(function(data) {
    $scope.tiles = data.data.tiles;
    return $scope.loading = false;
  });
});

angular.module('JKApp.home').controller('HomeController', function($scope, $document) {
  return $scope.scrollTopBio = function() {
    var element;
    element = angular.element(document.getElementById('bio'));
    console.log(element);
    return $document.scrollToElementAnimated(element);
  };
});

angular.module('JKApp.portfolio').controller('PortfolioController', function($scope, PortfolioService) {
  $scope.projects = PortfolioService.getProjects();
  $scope.filters = PortfolioService.getFilters($scope.projects);
  $scope.activeFilter = null;
  $scope.sorters = PortfolioService.getSorters($scope.projects);
  return $scope.activeSorter = $scope.sorters[0];
});

angular.module('JKApp.skills').controller('SkillsController', function() {});

angular.module('JKApp.social').controller('SocialController', function($scope, $window, SocialService, SocialFactory) {
  var load;
  load = function() {
    console.log('asd');
    return SocialService.getInstagramImages().then(function(response) {
      var instagramFeed;
      instagramFeed = new SocialFactory.ImageFeed(response.data.medias, $window.innerWidth);
      instagramFeed.draw('#instagram-feed');
      return angular.element($window).on('resize', function() {
        return instagramFeed.resize($window.innerWidth);
      });
    });
  };
  return load();
});

angular.module('JKApp.travel').controller('TravelController', function($scope, TravelFactory) {
  return $scope.places = TravelFactory.getPlaces();
});

angular.module('JKApp.bio').directive('jkBioTile', function() {
  return {
    scope: {
      tile: '=',
      index: '@'
    },
    controller: function($scope) {},
    replace: false,
    templateUrl: 'directives/jk_bio_tile.html'
  };
});

angular.module('JKApp.common').directive('jkScrollLoad', function($window, ScrollService) {
  return {
    replace: false,
    link: function(scope, element, attrs) {
      var execOnce, _ref;
      execOnce = (_ref = attrs.execOnce) != null ? _ref : false;
      return ScrollService.whenVisible(element, execOnce, function() {
        return scope.$apply(function() {
          return scope.load();
        });
      });
    }
  };
}).directive('jkViewLoader', function() {
  return {
    scope: {
      text: '@'
    },
    replace: true,
    templateUrl: 'directives/jk_view_loader.html'
  };
}).directive('jkLazyBg', function($http) {
  return {
    link: function(scope, element, attrs) {
      var path;
      path = "../images/" + attrs.jkLazyBg;
      return $http.get(path).then(function() {
        element.css('background-image', "url(" + path + ")");
        return element.css('opacity', '1');
      });
    }
  };
}).directive('jkViewTitle', function() {
  return {
    scope: {
      text: '='
    },
    replace: true,
    template: "<div class='view-title'> <div class='space-1'></div> <div class='space-2'><div class='line'></div></div> <div class='text' ng-bind='text'></div> <div class='space-2'><div class='line'></div></div> <div class='space-1'></div> </div>"
  };
}).directive('jkFollowScroll', function($window) {
  return {
    link: function(scope, element, attrs) {
      var fixed, initialTop, w;
      w = angular.element($window);
      initialTop = element[0].offsetTop;
      fixed = w[0].scrollY > initialTop;
      w.bind('resize', function() {
        return initialTop = element[0].offsetTop;
      });
      return w.bind('scroll load', function() {
        var windowTop;
        windowTop = w[0].scrollY;
        console.log(windowTop, initialTop);
        if (windowTop > initialTop) {
          if (!fixed) {
            element.addClass('menu-floating');
            element.removeClass('menu-fixed');
          }
          return fixed = true;
        } else {
          if (fixed) {
            element.removeClass('menu-floating');
            element.addClass('menu-fixed');
          }
          return fixed = false;
        }
      });
    }
  };
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('JKApp.portfolio').directive('jkProjectFilter', function() {
  return {
    scope: {
      filters: '=',
      activeFilter: '='
    },
    controller: function($scope) {
      $scope.clearFilter = function() {
        return $scope.activeFilter = null;
      };
      $scope.toggleFilter = function(filter) {
        if (($scope.activeFilter != null) && filter.name === $scope.activeFilter.name) {
          return $scope.activeFilter = null;
        } else {
          $scope.activeFilter = filter;
          return $scope.activeFilter.selected = [];
        }
      };
      $scope.toggleValue = function(value) {
        var v;
        if ($scope.activeFilter == null) {
          return;
        }
        if ($scope.isValueSelected(value)) {
          return $scope.activeFilter.selected = (function() {
            var _i, _len, _ref, _results;
            _ref = $scope.activeFilter.selected;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              v = _ref[_i];
              if (v !== value.name) {
                _results.push(v);
              }
            }
            return _results;
          })();
        } else {
          return $scope.activeFilter.selected.push(value.name);
        }
      };
      return $scope.isValueSelected = function(value) {
        var _ref;
        if ($scope.activeFilter == null) {
          return true;
        }
        return _ref = value.name, __indexOf.call($scope.activeFilter.selected, _ref) >= 0;
      };
    },
    replace: true,
    templateUrl: 'directives/jk_project_filter.html'
  };
}).directive('jkProjectSorter', function() {
  return {
    scope: {
      sorters: '=',
      activeSorter: '='
    },
    controller: function($scope) {
      return $scope.selectSorter = function(sorter) {
        if ($scope.activeSorter.name === sorter.name) {
          return $scope.activeSorter.reverse = !$scope.activeSorter.reverse;
        } else {
          sorter.reverse = false;
          return $scope.activeSorter = sorter;
        }
      };
    },
    replace: true,
    templateUrl: 'directives/jk_project_sorter.html'
  };
}).directive('jkProject', function() {
  return {
    scope: {
      project: '='
    },
    controller: function($scope) {
      $scope.opened = false;
      return $scope.toggle = function() {
        return $scope.opened = !$scope.opened;
      };
    },
    replace: true,
    templateUrl: 'directives/jk_project.html'
  };
});

angular.module('JKApp.skills');

angular.module('JKApp.social').directive('jkSocialFeed', function($compile, SocialService) {
  return {
    scope: {
      items: '='
    },
    templateUrl: 'directives/jk_social_feed.html'
  };
});

angular.module('JKApp.travel').directive('jkMap', function($window, $timeout, TravelFactory) {
  return {
    scope: {
      items: '='
    },
    controller: function($scope, $element) {
      var draw, getSize, map, resizePromise;
      map = null;
      getSize = function() {
        var element, h, w;
        element = angular.element($element);
        w = element[0].offsetWidth;
        h = w / 1.4;
        return {
          width: w,
          height: h
        };
      };
      draw = function() {
        map = new TravelFactory.JKMap('#map-container', '/json/world-110m.json', getSize());
        return map.draw();
      };
      resizePromise = null;
      angular.element($window).bind('resize', function() {
        if (resizePromise != null) {
          $timeout.cancel(resizePromise);
        }
        return resizePromise = $timeout(function() {
          return map.resize(getSize());
        }, 1000);
      });
      return draw();
    },
    templateUrl: 'directives/jk_map.html'
  };
}).filter('leftSidePlaces', function() {
  return function(places) {
    return places.slice(0, +(places.length / 2 - 1) + 1 || 9e9);
  };
}).filter('rightSidePlaces', function() {
  return function(places) {
    return places.slice(places.length / 2, +(places.length - 1 - (places.length % 2)) + 1 || 9e9);
  };
});

angular.module('JKApp.portfolio').factory('PortfolioFactory', function() {
  var methods;
  methods = {
    getProjects: function() {
      return [
        {
          name: 'CMS website for an international electricity market',
          technologies: ['jasmine', 'karma', 'angularjs', 'episerver', 'html5', 'highcharts', '.net'],
          description: "Official website for an international company. Content management system allows editors to publish news and articles. Integration with external data sources for retrieving market data and operational messages.",
          type: 'work',
          role: 'Software developer',
          tasks: ['Writing backend API methods for retrieving page structures from EPiServer', 'Creating interactive data representations with Highcharts', 'Displaying numerical data on custom Highmaps', 'Implementing dashboard for showing data with AngularJS', 'Testing front-end with Jasmine and Karma'],
          url: null,
          time: {
            format: 'mm/yyyy',
            start: new Date('4-1-2014'),
            end: null
          }
        }, {
          name: "Master's thesis at Aalto University School of Science",
          technologies: ['java', 'cep', 'hibernate', 'machine learning', 'wavelets'],
          description: "Master's thesis topic: Predicting Complex Events in Sensor Data. I used machine learning techniques to predict events in sensor data. Models were tested in practive with so-called intelligent house.",
          type: 'school',
          role: 'researcher',
          tasks: ['Comprehensive literature review', 'Developing mathematical theory for predictive analytics', 'Implementing testing framework with Java and 3rd party libraries', 'Writing thesis report'],
          time: {
            format: 'mm/yyyy',
            start: new Date('2-1-2013'),
            end: new Date('6-20-2013')
          }
        }
      ];
    }
  };
  return methods;
});

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('JKApp.social').factory('SocialFactory', function() {
  var ImageFeed;
  ImageFeed = (function() {
    function ImageFeed(items, width, active) {
      this.items = items;
      this.width = width;
      this.active = active != null ? active : 0;
      this.draw = __bind(this.draw, this);
      this.resize = __bind(this.resize, this);
      this.update = __bind(this.update, this);
      this.getImageClass = __bind(this.getImageClass, this);
      this.getImageWidth = __bind(this.getImageWidth, this);
      this.calculateProperties = __bind(this.calculateProperties, this);
      this.n = this.items.length;
      this.nSide = 2;
      this.nLeftSide = 0;
      this.nRightSide = 0;
      this.properties = {};
      this.breakPoint = 600;
    }

    ImageFeed.prototype.calculateProperties = function() {
      var activeW, hiddenTotalW, hiddenW, sideW, spaceLeft, spaceRight;
      hiddenTotalW = this.width >= this.breakPoint ? 30 : 0;
      activeW = this.width >= this.breakPoint ? 30 : 50;
      sideW = (100 - activeW - hiddenTotalW) / (2 * this.nSide);
      hiddenW = hiddenTotalW / (this.n - 2 * this.nSide - 1);
      this.properties = {
        active: activeW,
        side: sideW,
        hidden: hiddenW
      };
      spaceLeft = this.active;
      spaceRight = this.n - this.active - 1;
      this.nLeftSide = Math.min(spaceLeft, this.nSide);
      this.nRightSide = Math.min(spaceRight, this.nSide);
      if (this.nRightSide < this.nSide) {
        this.nLeftSide += this.nSide - this.nRightSide;
      }
      if (this.nLeftSide < this.nSide) {
        return this.nRightSide += this.nSide - this.nLeftSide;
      }
    };

    ImageFeed.prototype.getImageWidth = function(i) {
      if (i === this.active) {
        return this.properties.active;
      } else if (i >= this.active - this.nLeftSide && i <= this.active + this.nRightSide) {
        return this.properties.side;
      } else {
        return this.properties.hidden;
      }
    };

    ImageFeed.prototype.getImageClass = function(i) {
      if (i === this.active) {
        return 'image image-active';
      } else if (i >= this.active - this.nLeftSide && i < this.active) {
        return 'image image-side image-side-left';
      } else if (i <= this.active + this.nRightSide && i > this.active) {
        return 'image image-side image-side-right';
      } else if (i < this.active - this.nLeftSide) {
        return 'image image-hidden image-hidden-left';
      } else {
        return 'image image-hidden image-hidden-right';
      }
    };

    ImageFeed.prototype.loadImage = function(element, data) {
      var img;
      img = new Image();
      img.src = data.image.url;
      return d3.select(img).on('load', function() {
        return element.transition().duration(500).style({
          'background-image': "url(" + data.image.url + ")",
          opacity: 1
        });
      });
    };

    ImageFeed.prototype.update = function(active) {
      var feed, oldActive;
      oldActive = this.active;
      this.active = active;
      this.calculateProperties();
      feed = this;
      this.container.selectAll('div.image p').text('');
      return this.container.selectAll('div.image').attr('class', function(d, i) {
        return feed.getImageClass(i);
      }).transition().duration(500).styleTween('width', function(d, i, a) {
        var oldWidth;
        oldWidth = d.width;
        d.width = "" + (feed.getImageWidth(i)) + "%";
        return d3.interpolate(oldWidth, d.width);
      }).each('end', function(d, i) {
        return d3.select(this).select('p').text(function(d) {
          if (i === feed.active) {
            return d.caption;
          } else {
            return '';
          }
        });
      });
    };

    ImageFeed.prototype.resize = function(width) {
      this.container.selectAll('div.image').style('padding-bottom', (function(_this) {
        return function(d, i) {
          return "" + (_this.getImageWidth(_this.active)) + "%";
        };
      })(this));
      this.width = width;
      return this.update(this.active);
    };

    ImageFeed.prototype.draw = function(elementId) {
      var enter, self;
      this.container = d3.select(elementId).append('div').attr('class', 'image-feed');
      this.calculateProperties();
      self = this;
      enter = this.container.selectAll('div.image').data(this.items).enter();
      enter.append('div').attr('class', (function(_this) {
        return function(d, i) {
          return _this.getImageClass(i);
        };
      })(this)).style({
        'padding-bottom': (function(_this) {
          return function(d, i) {
            return "" + (_this.getImageWidth(_this.active)) + "%";
          };
        })(this),
        width: (function(_this) {
          return function(d, i) {
            d.width = "" + (_this.getImageWidth(i)) + "%";
            return d.width;
          };
        })(this),
        opacity: 0
      }).each(function(d, i) {
        return self.loadImage(d3.select(this), d);
      }).on('click', (function(_this) {
        return function(d, i) {
          return _this.update(i);
        };
      })(this)).append('p');
      return this.update(this.active);
    };

    return ImageFeed;

  })();
  return {
    ImageFeed: ImageFeed
  };
});

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('JKApp.travel').factory('TravelFactory', function($timeout) {
  var JKMap, getCurrentCountry, getPlaces, getVisitedCountries;
  getPlaces = function() {
    return [
      {
        id: 0,
        name: 'Pieni Kaijansaari, Kuopio, Finland',
        location: [62.892500, 27.678333],
        description: "My family's summer cottage on a small island. Amazing sunsets in the summer time."
      }, {
        id: 1,
        name: 'Victoria Peak, Hong Kong',
        location: [22.396428, 114.109497],
        description: "The best sunset I've ever seen. Hint: take a taxi to the top instead of queueing to the cable car."
      }, {
        id: 2,
        name: 'Kangaroo Point, Brisbane, Australia',
        location: [-27.471011, 153.023449],
        description: 'My Australian home during the exchange studies. I really miss the dinners on our big balcony.'
      }, {
        id: 3,
        name: 'Great Barrier Reef, Australia',
        location: [-18.286130, 147.700008],
        description: 'One of the highlights in Australia. The underwater wild life here is really varied and impressive.'
      }, {
        id: 4,
        name: 'Milford Sound, New Zealand',
        location: [-44.671625, 167.925621],
        description: 'The land of the Hobbit at its best. Steep mountains full of waterfalls made me not believe my eyes.'
      }, {
        id: 5,
        name: 'Bergen, Norway',
        location: [60.391263, 5.322054],
        description: "The city between the seven mountains. The view in the city is great."
      }, {
        id: 6,
        name: 'Alcatraz, San Francisco, USA',
        location: [37.826977, -122.422956],
        description: 'Despite the tourist crowds, the atmosphere here is unique.'
      }, {
        id: 7,
        name: 'Hvar, Croatia',
        location: [43.172948, 16.441114],
        description: 'We stopped here for one day during an island hopping cruise. This island has stunning nature'
      }, {
        id: 8,
        name: 'Wall Street, New York, USA',
        location: [40.706001, -74.008819],
        description: 'Description'
      }
    ];
  };
  getCurrentCountry = function() {
    return 246;
  };
  getVisitedCountries = function() {
    return [36, 40, 84, 188, 191, 196, 203, 208, 222, 233, 242, 246, 248, 250, 276, 292, 300, 320, 336, 340, 344, 348, 356, 380, 428, 484, 516, 554, 558, 578, 616, 620, 630, 724, 752, 756, 764, 784, 788, 792, 840];
  };
  JKMap = (function() {
    function JKMap(containerId, jsonPath, initialSize) {
      this.containerId = containerId;
      this.jsonPath = jsonPath;
      this.initialSize = initialSize;
      this.resize = __bind(this.resize, this);
      this.updateMap = __bind(this.updateMap, this);
      this.rotate = __bind(this.rotate, this);
      this.rotateToPlace = __bind(this.rotateToPlace, this);
      this.draw = __bind(this.draw, this);
      this.getPlaceTop = __bind(this.getPlaceTop, this);
      this.getPlaceClass = __bind(this.getPlaceClass, this);
      this.getCountryClass = __bind(this.getCountryClass, this);
      this.data = {
        currentCountry: getCurrentCountry(),
        visitedCountries: getVisitedCountries(),
        places: getPlaces().map(function(place) {
          return {
            id: place.id,
            name: place.name,
            type: 'Point',
            radius: 5,
            coordinates: [place.location[1], place.location[0]],
            description: place.description
          };
        }),
        currentPlaceIndex: 0
      };
      this.places = {
        title: 35,
        gutter: 5,
        body: 50,
        activeMargin: 0,
        border: 1
      };
      this.transitionDuration = 1500;
    }

    JKMap.prototype.getCountryClass = function(country) {
      var _ref;
      if (country.id === this.data.currentCountry) {
        return 'country country-current';
      } else if (_ref = country.id, __indexOf.call(this.data.visitedCountries, _ref) >= 0) {
        return 'country country-visited';
      } else {
        return 'country';
      }
    };

    JKMap.prototype.getPlaceClass = function(place) {
      if (place.id === this.data.currentPlaceIndex) {
        return 'place active';
      } else {
        return 'place';
      }
    };

    JKMap.prototype.createPath = function() {
      this.projection = d3.geo.orthographic().scale(this.size.width / 3).translate([this.size.width / 2, this.size.height / 2]).clipAngle(90);
      return this.path = d3.geo.path().projection(this.projection).pointRadius(function(d) {
        return d.radius;
      });
    };

    JKMap.prototype.getPlaceTop = function(place) {
      return place.id * (this.places.title + this.places.gutter);
    };

    JKMap.prototype.draw = function() {
      var body, divSelectedPlace;
      this.size = this.initialSize;
      this.createPath();
      this.svg = d3.select(this.containerId).append('svg').attr('width', this.size.width).attr('height', this.size.height);
      body = d3.select('body');
      this.sphere = this.svg.append('path').attr('class', 'sphere').datum({
        type: 'Sphere'
      }).attr('d', this.path);
      this.gCountries = this.svg.append('g').attr('class', 'countries');
      this.gPlaces = this.svg.append('g').attr('class', 'places');
      divSelectedPlace = body.select('#travel-places').append('div').attr('class', 'selected-place');
      this.divSelectedPlaceTitle = divSelectedPlace.append('div').attr('class', 'selected-place-title');
      this.divSelectedPlaceText = divSelectedPlace.append('div').attr('class', 'selected-place-text');
      this.divPlaces = body.select('#travel-places').append('div').attr('class', 'travel-places-inner');
      this.placeLine = null;
      return d3.json(this.jsonPath, (function(_this) {
        return function(err, world) {
          var divs, i, nextPlace;
          _this.gCountries.selectAll('path.country').data(topojson.feature(world, world.objects.countries).features).enter().append('path').attr('class', function(country) {
            return _this.getCountryClass(country);
          }).attr('d', _this.path);
          _this.gPlaces.selectAll('path.place').data(_this.data.places).enter().append('path').attr('class', function(place) {
            return _this.getPlaceClass(place);
          }).attr('d', _this.path).on('click', function(place) {
            return _this.rotateToPlace(place.id);
          });
          divs = _this.divPlaces.selectAll('div.place').data(_this.data.places).enter().append('div').attr('class', 'place').append('a').attr('href', '#/travel').text(function(p) {
            return p.name;
          }).on('click', function(place) {
            return _this.rotateToPlace(place.id);
          });
          i = 0;
          nextPlace = function() {
            _this.rotateToPlace(_this.data.places[i]);
            i = (i + 1) % _this.data.places.length;
            return $timeout(nextPlace, 10000);
          };
          return _this.rotateToPlace(_this.data.currentPlaceIndex);
        };
      })(this));
    };

    JKMap.prototype.rotateToPlace = function(placeIndex) {
      var p, place, _i, _len, _ref;
      place = this.data.places[placeIndex];
      this.data.currentPlaceIndex = placeIndex;
      this.divSelectedPlaceTitle.text(place.name);
      this.divSelectedPlaceText.text(place.description);
      _ref = this.data.places;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        p.radius = 5;
      }
      place.radius = 10;
      return this.rotate(place.coordinates);
    };

    JKMap.prototype.rotate = function(coordinates) {
      var x1, x2, y1, y2;
      if (this.placeLine != null) {
        this.placeLine.remove();
      }
      x1 = this.size.width / 2;
      y1 = this.size.height / 2;
      x2 = this.size.width - this.places.activeMargin;
      y2 = 20;
      this.placeLine = this.svg.append('line').attr('x1', x2).attr('y1', y2).attr('x2', x2).attr('y2', y2).attr('stroke-width', 4).attr('stroke', '#E36532');
      return d3.transition().duration(this.transitionDuration).tween('rotate', (function(_this) {
        return function() {
          var r, x, y;
          r = d3.interpolate(_this.projection.rotate(), [-coordinates[0], -coordinates[1]]);
          x = d3.interpolateNumber(x2, x1);
          y = d3.interpolateNumber(y2, y1);
          return function(t) {
            _this.projection.rotate(r(t));
            _this.placeLine.attr('x1', x(t)).attr('y1', y(t));
            return _this.updateMap();
          };
        };
      })(this));
    };

    JKMap.prototype.updateMap = function() {
      this.sphere.attr('d', this.path);
      this.gCountries.selectAll('path.country').attr('d', (function(_this) {
        return function(o) {
          return _this.path(o) || 'M0,0';
        };
      })(this));
      this.gPlaces.selectAll('path.place').attr('d', (function(_this) {
        return function(o) {
          return _this.path(o) || 'M0,0';
        };
      })(this));
      return this.divPlaces.selectAll('div.place').attr('class', (function(_this) {
        return function(place) {
          return _this.getPlaceClass(place);
        };
      })(this));
    };

    JKMap.prototype.resize = function(size) {
      this.size = size;
      this.createPath();
      this.svg.attr('width', size.width).attr('height', size.height);
      return this.rotateToPlace(this.data.currentPlaceIndex);
    };

    return JKMap;

  })();
  return {
    JKMap: JKMap,
    getPlaces: getPlaces
  };
});

angular.module('JKApp.portfolio').filter('filterProjects', function() {
  return function(projects, filter) {
    if (filter == null) {
      return projects;
    }
    return projects.filter(function(project) {
      return filter.isVisible(project);
    });
  };
}).filter('sortProjects', function() {
  return function(projects, sorter) {
    if (sorter == null) {
      return projects;
    }
    projects.sort(sorter.sortFunction);
    if (sorter.reverse) {
      projects = projects.reverse();
    }
    return projects;
  };
}).filter('projectTimeFormat', function() {
  return function(time) {
    var format, str;
    format = function(date) {
      var month;
      month = date.getMonth();
      month = month < 10 ? "0" + month : month;
      return "" + month + "/" + (date.getFullYear());
    };
    str = "" + (format(time.start)) + " -";
    if (time.end != null) {
      str += " " + (format(time.end));
    }
    return str;
  };
});

angular.module('JKApp.bio').service('BioService', function($http) {
  return {
    getBioTiles: function() {
      return $http.get('/bio');
    }
  };
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('JKApp.portfolio').service('PortfolioService', function(PortfolioFactory) {
  var methods;
  methods = {
    getProjects: function() {
      return PortfolioFactory.getProjects();
    },
    getFilters: function(projects) {
      return [
        {
          name: 'filter by topics',
          values: methods.parseTechnologies(projects),
          selected: [],
          isVisible: function(project) {
            var t;
            return ((function() {
              var _i, _len, _ref, _results;
              _ref = project.technologies;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                t = _ref[_i];
                if (__indexOf.call(this.selected, t) >= 0) {
                  _results.push(t);
                }
              }
              return _results;
            }).call(this)).length > 0;
          }
        }, {
          name: 'filter by type',
          values: methods.parseProjectTypes(projects),
          selected: [],
          isVisible: function(project) {
            var _ref;
            return _ref = project.type, __indexOf.call(this.selected, _ref) >= 0;
          }
        }
      ];
    },
    getSorters: function() {
      return [
        {
          name: 'sort by time',
          sortFunction: function(p1, p2) {
            if (p1.time.start === p2.time.start) {
              return p1.time.end - p2.time.end;
            } else {
              return p1.time.start - p2.time.start;
            }
          },
          reverse: false
        }, {
          name: 'sort alphabetically',
          sortFunction: function(p1, p2) {
            if (p1.name < p2.name) {
              return -1;
            } else if (p1.name > p2.name) {
              return 1;
            } else {
              return 0;
            }
          },
          reverse: false
        }
      ];
    },
    sortFilterValues: function(obj) {
      var key;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = Object.keys(obj);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          _results.push(obj[key]);
        }
        return _results;
      })()).sort(function(t1, t2) {
        if (t1.name < t2.name) {
          return -1;
        } else if (t1.name > t2.name) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    parseTechnologies: function(projects) {
      var project, technologies, technology, _i, _j, _len, _len1, _ref;
      technologies = {};
      for (_i = 0, _len = projects.length; _i < _len; _i++) {
        project = projects[_i];
        _ref = project.technologies;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          technology = _ref[_j];
          if (technology in technologies) {
            technologies[technology].count++;
          } else {
            technologies[technology] = {
              name: technology,
              count: 1
            };
          }
        }
      }
      return methods.sortFilterValues(technologies);
    },
    parseProjectTypes: function(projects) {
      var project, projectTypes, _i, _len;
      projectTypes = {};
      for (_i = 0, _len = projects.length; _i < _len; _i++) {
        project = projects[_i];
        if (project.type in projectTypes) {
          projectTypes[project.type].count++;
        } else {
          projectTypes[project.type] = {
            name: project.type,
            count: 1
          };
        }
      }
      return methods.sortFilterValues(projectTypes);
    }
  };
  return methods;
});

angular.module('JKApp.common').service('ScrollService', function($window) {
  return {
    whenVisible: function(element, execOnce, inCallback) {
      var events, isInside;
      isInside = function(top, bottom, height) {
        return (top >= 0 && top <= height) || (bottom >= 0 && bottom <= height) || (top <= 0 && bottom >= height);
      };
      events = 'scroll load';
      return angular.element($window).bind(events, function() {
        var elementBottom, elementTop, windowHeight;
        elementTop = element[0].getBoundingClientRect().top;
        elementBottom = element[0].getBoundingClientRect().bottom;
        windowHeight = $window.innerHeight;
        if (isInside(elementTop, elementBottom, windowHeight)) {
          inCallback();
          if (execOnce) {
            return angular.element($window).unbind(events);
          }
        }
      });
    }
  };
});

angular.module('JKApp.social').service('SocialService', function($http, $q, $timeout) {
  return {
    getInstagramImages: function() {
      return $http.get('/ig');
    },
    getTweets: function() {
      var deferred, getTimestamp, resolve;
      deferred = $q.defer();
      getTimestamp = function(dateStr) {
        return ((new Date(dateStr)).getTime() / 1000).toFixed(0);
      };
      resolve = function() {
        return deferred.resolve({
          data: {
            tweets: [
              {
                type: 'text',
                text: 'first tweet',
                timestamp: getTimestamp('2014-06-06')
              }, {
                type: 'text',
                text: 'second tweet',
                timestamp: getTimestamp('2014-07-06')
              }, {
                type: 'text',
                text: 'third tweet',
                timestamp: getTimestamp('2014-08-06')
              }, {
                type: 'text',
                text: 'fourth tweet',
                timestamp: getTimestamp('2014-09-04')
              }
            ]
          }
        });
      };
      $timeout(resolve, 2000);
      return deferred.promise;
    },
    addNewItems: function(oldItems, newItems) {
      var items;
      oldItems = angular.copy(oldItems);
      items = oldItems.concat(newItems);
      items = items.sort(function(a, b) {
        return a.timestamp - b.timestamp;
      });
      return items;
    }
  };
});
