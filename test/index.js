'use strict';

var fround = require('../');
var test = require('tape');
var runTests = require('./tests');

test('as a function', function (t) {
	runTests(fround, t);

	t.end();
});
