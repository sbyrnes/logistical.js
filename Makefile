test: tests
tests:
	./node_modules/mocha/bin/mocha

debug-t:
	./node_modules/mocha/bin/mocha debug

coverage:
	./node_modules/mocha/bin/mocha -r blanket -R html-cov > coverage.html	
	open coverage.html
