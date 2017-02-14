module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [{
                    expand: true,
                    src: ['modules.js', 'app.js'
                    , 'router.js', 'controller/*.js', 'service/*.js'],
                    dest: './tmp',
                    ext: '.annotated.js', // Dest filepaths will have this extension.
                    extDot: 'last', // Extensions in filenames begin after the last dot
                }]
            }
        },
        concat: {
            js: {
                src: ['./tmp/modules.annotated.js','./tmp/**/*.annotated.js','!tmp/modules.annotated.js'],
                dest: './cache/min/app.debug.js'
            }
        },
        uglify: {
            js: { //target
                src: ['./cache/min/app.debug.js'],
                dest: './cache/min/app.js'
            }
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');

    //register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify']);
}
