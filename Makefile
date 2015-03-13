test: tests
tests:
	#./node_modules/gulp/bin/gulp.js mocha
	./node_modules/mocha/bin/mocha -R spec

watch:
	#./node_modules/gulp/bin/gulp.js watch-mocha
	./node_modules/mocha/bin/mocha watch

debug-tests:
	./node_modules/mocha/bin/mocha debug

coverage:
	./node_modules/mocha/bin/mocha -r blanket -R html-cov > coverage.html	
	open coverage.html

api:
	@echo 'Classifier API'
	@ack -i '^Classifier' logistical.js
	@echo
	@echo 'Support API'
	@ack -i '^module.exports' lib/support.js

.PHONY: list

targets: list
list:
	@grep '^\w' Makefile | sed 's/:.*//' | sort | uniq
