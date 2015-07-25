module.exports = function(grunt) {

    var timestamp = Date.now();

    var env = grunt.option('env') || "dev";

    console.log(env);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            default: ['dist/*']
        },

        copy: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**', '**/*'],
                    dest: 'dist'
                }]
            }
        },

        sass: {
            options: {
                style: "compressed",
                sourcemap: "inline"
            },
            default: {
                files: [{
                    expand: true,
                    cwd: 'src/css/scss',
                    src: ['*.scss', '**/*.scss'],
                    dest: 'dist/css/',
                    ext: '.min.css'
                }]
            }
        },

        autoprefixer: {
            options: {
                diff: true,
                map: true
            },
            default: {
                src: 'dist/css/main.min.css'
            }           
        },

        concat: {
            options: {
                separator: ';'
            },
            hacks: {
                files: [{
                    src: ['bower_components/angular/angular.min.js', 'bower_components/angular-*/angular-*.min.js'],
                    dest: 'dist/js/vendors.min.js'
                },{
                    src: ['src/app/config_'+ env +'.js', 'src/app/app.js', 'src/app/services.js', 'src/app/controllers/top100.js'],
                    dest: 'dist/js/app.js'
                }]
            }
        },

        watch: {
            options: {
                livereload: false,
            },
            css: {
                files: ['src/css/scss/*.scss', 'src/css/scss/**/*.scss'],
                tasks: ['css']
            },
            js: {
                files: ['src/app/*.js', 'src/app/**/*.js'],
                tasks: ['js']
            },
            html: {
                files: ['src/**', 'src/**/*', '!**/*.scss', '!**/*.js'],
                tasks: ['html']
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'dist/css/*.css', 'dist/css/**/*.css',
                        'dist/app/*.js', 'dist/app/**/*.js',
                        'dist/**', 'dist/**/*'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './dist'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('html', ['copy']);
    grunt.registerTask('css', ['sass', 'autoprefixer']);
    grunt.registerTask('js', ['concat']);

    grunt.registerTask('publish', ['clean', 'html', 'css', 'js']);
    grunt.registerTask('default', ['publish', 'browserSync', 'watch']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};
