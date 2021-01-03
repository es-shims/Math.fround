'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (true) {
		return implementation;
	}

	return Math.fround;
};
