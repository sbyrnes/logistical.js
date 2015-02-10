test: tests
tests:
	./node_modules/mocha/bin/mocha

coverage:
	./node_modules/mocha/bin/mocha -r blanket -R html-cov > coverage.html	
	open coverage.html
