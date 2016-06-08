/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
	// JavaScript minification
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Project configuration. 
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				  '<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			my_target: {
				files: [{
					expand: true,
					cwd: 'assets/js',
					src: '**/*.js',
					dest: '..//js'
				}]
			}
		}
	});
};