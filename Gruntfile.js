module.exports = function(grunt) {

    var timestamp = Date.now();

    var env = grunt.option('env') || "dev";

    var assetsPath = (env == 'dev') ? './' : '/special/rewind/';

    console.log(" ");

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
                    src: ['**', '**/*', '!css/scss/**', '!css/scss/**/*'],
                    dest: 'dist'
                },
                {
                    expand: true,
                    cwd: 'bower_components/susy/sass',
                    src: ['**', '**/*'],
                    dest: 'src/css/scss/vendors/susy'
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
                map: false
            },
            default: {
                src: 'dist/css/style.min.css'
            }           
        },

        concat: {
            options: {
                separator: ";\n"
            },
            default: {
                files: [{
                    src: ['bower_components/angular/angular.min.js', 'bower_components/angular-*/angular-*.min.js', 'bower_components/angular-*/**/angular-*.min.js', 'bower_components/jquery/dist/jquery.min.js'],
                    dest: 'dist/js/vendors.min.js'
                },
                {
                    src: ['src/js/player.js'],
                    dest: 'dist/js/player.js'
                },
                {
                    src: ['src/app/config_'+ env +'.js', 'src/app/app.js', 'src/app/services.js', 'src/app/directives.js', 'src/app/controllers/*.js'],
                    dest: 'dist/js/app.js'
                }]
            }
        },

        processhtml: {
            default: {
                options: {
                    data: {
                        assetsPath: assetsPath,
                        timestamp: timestamp,
                        env: env
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['index.html'],
                    dest: 'dist'
                }]
            }
        },

        watch: {
            options: {
                livereload: false,
            },
            css: {
                files: ['src/css/scss/**/*.scss'],
                tasks: ['css']
            },
            js: {
                files: ['src/app/**/*.js', 'src/js/*.js'],
                tasks: ['js']
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['html']
            },
            json: {
                files: ['src/**/*.json'],
                tasks: ['html']
            },
            img: {
                files: ['src/**/*.(jpg|png|gif)'],
                tasks: ['html']
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'dist/css/*.css',
                        'dist/js/*.js',
                        'dist/**/*.html',
                        'dist/**/*.json',
                        'dist/**/*.(jpg|png|gif)'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './dist'
                }
            }
        },

        'ftp-deploy': {
            default: {
                auth: {
                    host: 'ftp.thebackpackerz.com',
                    port: 21,
                    authKey: env
                },
                src: 'dist/',
                dest: 'www/special/rewind/',
                forceVerbose: true
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-ftp-deploy');

    grunt.registerTask('html', ['copy', 'processhtml']);
    grunt.registerTask('css', ['sass', 'autoprefixer']);
    grunt.registerTask('js', ['concat']);

    grunt.registerTask('deploy', ['publish', 'ftp-deploy']);
    grunt.registerTask('publish', ['clean', 'html', 'css', 'js']);
    grunt.registerTask('default', ['publish', 'browserSync', 'watch']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};
