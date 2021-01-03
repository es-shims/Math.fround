'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimMathFround() {
	var polyfill = getPolyfill();
	define(Math, { fround: polyfill });
	return polyfill;
};
