module.exports = function(grunt){

	grunt.initConfig({
		less:{
			buildCss:{
				files:{
					'css/styles.css':'css/styles.less'
				}
			}
		},
		concat:{
			js:{
				src: ['js/apps/services/*.js', 'js/apps/directives/*.js', 'js/apps/controllers/*.js'],
				dest: 'js/apps/app.js',
			}
		},
		cssmin:{
			css:{
				src:'css/styles.css',
				dest:'css/styles.min.css'
			}
		},
		uglify:{
			minifyJs:{
				files:{
					'js/apps/app.min.js' : 'js/apps/app.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default',['concat','uglify', 'cssmin']);

};