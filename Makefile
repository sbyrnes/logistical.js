test: tests
tests:
	./node_modules/gulp/bin/gulp.js mocha

watch:
	./node_modules/gulp/bin/gulp.js watch-mocha

debug-tests:
	./node_modules/mocha/bin/mocha debug

coverage:
	./node_modules/mocha/bin/mocha -r blanket -R html-cov > coverage.html	
	open coverage.html
