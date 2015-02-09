#!/bin/bash
./node_modules/mocha/bin/mocha -r blanket -R html-cov > coverage.html
