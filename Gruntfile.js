module.exports = function (grunt) {
    "use strict";

    // Files for watching
    var jsfiles = ['README.md', 'package.json', 'js/**/*.js', '!js/lib/**/*.js'];

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',

        /**
        * Less
        */
        less: {
            dev: {
                files: {
                    "css/styles.min.css": "less/*.less"
                },
                options: {
                    compress: true,
                    cleancss: true,
                    cleancssOptions: {
                        keepSpecialComments: "*"
                    }
                }
            }
        },

        /**
         * JS Documentation
         */
        jsdoc : {
            dist : {
                src: jsfiles,
                options: {
                    destination: 'docs',
                    template : "node_modules/jaguarjs-jsdoc",
                    configure : "conf/jsdoc.json"
                }
            }
        },

        /**
         * Cleans
         */
        clean: ['docs'],

        /**
        * Watch
        */
        watch: {
            styles: {
                files: ['less/**/*.less'],
                tasks: ['less']
            },
            scripts: {
                files: jsfiles,
                tasks: ['jsbeautifier', 'doc']
            }
        },
        
        /**
        * jsbeautifier
        */
        jsbeautifier: {
            files: ["js/**/*.js", "!js/lib/**/*.js"],
            options: {
                config: ".jsbeautifyrc"
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-jsbeautifier");

    // Developer
    grunt.registerTask('default', ['jsbeautifier', 'doc', 'less']);
    grunt.registerTask('doc', ['clean', 'jsdoc']);
    grunt.registerTask('docking', 'jsdoc', 'watch:scripts');

};