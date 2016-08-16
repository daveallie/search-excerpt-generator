module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'src/wrapper/intro.js',
          'src/helpers/*.js',
          'src/*.js',
          'src/wrapper/outro.js',
        ],
        dest: 'dist/<%= pkg.name %>.js',
        options: {
          banner: "/*!\n * <%= pkg.name %> v<%= pkg.version %>\n * https://github.com/daveallie/search-excerpt-generator\n */\n\n"
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        },
        options: {
          banner: "/*! <%= pkg.name %> v<%= pkg.version %> - https://github.com/daveallie/search-excerpt-generator */\n"
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
