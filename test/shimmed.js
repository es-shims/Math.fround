'use strict';

require('../shim')();

var test = require('tape');
var defineProperties = require('define-properties');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = require('functions-have-names')();

var runTests = require('./tests');

test('shimmed', function (t) {
	t.equal(Math.fround.length, 1, 'Math.fround has a length of 1');

	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(Math.fround.name, 'fround', 'Math.fround has name "fround"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(Math, 'fround'), 'Math.fround is not enumerable');
		et.end();
	});

	runTests(Math.fround, t);

	t.end();
});
