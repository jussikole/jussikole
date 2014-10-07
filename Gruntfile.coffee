module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    clean:
      html:
        src: ['build/**/*.html']
      css:
        src: ['build/styles']
      js:
        src: ['build/scripts', 'server']
    haml:
      compile:
        expand: true
        flatten: false
        cwd: 'src/haml'
        src: '**/*.haml'
        dest: 'build'
        ext: '.html'
    coffee:
      compile:
        options:
          bare: true
        files:
          'build/scripts/main.js': ['src/coffee/main.coffee']
          'build/scripts/app.js': ['src/coffee/app/**/*.coffee']
      compileServer:
        options:
          bare: true
        expand: true
        flatten: false
        cwd: 'src/server'
        src: '**/*.coffee'
        dest: 'server/'
        ext: '.js'
    less:
      compile:
        files:
          'build/styles/jk.css': 'src/less/main.less'
    copy:
      js:
        expand: true
        flatten: true
        cwd: 'bower_components/'
        src: [
          'angular/angular.js'
          'angular-route/angular-route.js'
          'angular-sanitize/angular-sanitize.js'
          'bootstrap/dist/js/bootstrap.js'
          'angular-scroll/angular-scroll.js'
          'angular-parallax/scripts/angular-parallax.js'
          'd3/d3.js'
          'topojson/topojson.js'
          'datamaps/dist/datamaps.world.js'
        ]
        dest: 'build/scripts/lib'
      fonts:
        expand: true
        flatten: true
        cwd: 'bower_components/'
        src: [
          'bootstrap/fonts/*'
        ]
        dest: 'build/fonts'
      images:
        expand: true
        flatten: true
        cwd: 'src/images'
        src: [
          '*.*'
        ]
        dest: 'build/images'  
      json:
        expand: true
        flatten: true
        cwd: 'src/json'
        src: [
          '*.json'
        ]
        dest: 'build/json'  
    watch:
        coffee:
            files: ['src/coffee/**/*.coffee']
            tasks: ['coffee']
        less:
            files: ['src/less/**/*.less']
            tasks: ['less']
        haml:
            files: ['src/haml/**/*.haml']
            tasks: ['haml']
  
  grunt.loadNpmTasks 'grunt-bower-task'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-haml'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  
  grunt.registerTask 'default', [
    'clean', 
    'haml', 
    'coffee', 
    'less', 
    'copy'
  ]