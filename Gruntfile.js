/*

  Dependencies:

  + npm
  + grunt-cli
    > npm install -g grunt-cli

  Setup:

  > npm install

*/

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    uncss: {
      dist: {
        src: ['app/index.html'],
        dest: 'app/css/tidy.css',
        options: {
          report: 'min'
        }
      }
    },

    jshint: {
      all: ['app/js/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jsbeautifier: {
      modify: {
        src: ['app/js/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['app/js/**/*.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');


  // Verify code before a commit
  grunt.registerTask('clean', [
    'jsbeautifier:modify',
    'jshint'
  ]);

  // Build test for Travis
  grunt.registerTask('verify', [
    'jshint'
  ]);

};
