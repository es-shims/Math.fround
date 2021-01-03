'use strict';

var isNaN = require('is-nan');

var $isFinite = isFinite;
var $Number = Number;
var abs = Math.abs;

var BINARY_32_EPSILON = 1.1920928955078125e-7; // 2 ** -23;
var BINARY_32_MIN_VALUE = 1.1754943508222875e-38; // 2 ** -126;
var BINARY_32_MAX_VALUE = 3.4028234663852886e+38; // 2 ** 128 - 2 ** 104
var EPSILON = 2.220446049250313e-16; // Number.EPSILON

var inverseEpsilon = 1 / EPSILON;
var roundTiesToEven = function roundTiesToEven(n) {
	// Even though this reduces down to `return n`, it takes advantage of built-in rounding.
	return (n + inverseEpsilon) - inverseEpsilon;
};

module.exports = function fround(x) {
	var v = $Number(x);
	if (v === 0 || isNaN(v) || !$isFinite(v)) {
		return v;
	}
	var s = v < 0 ? -1 : 1;
	var mod = abs(v);
	if (mod < BINARY_32_MIN_VALUE) {
		return (
			s
			* roundTiesToEven(mod / BINARY_32_MIN_VALUE / BINARY_32_EPSILON)
			* BINARY_32_MIN_VALUE * BINARY_32_EPSILON
		);
	}
	// Veltkamp's splitting (?)
	var a = (1 + (BINARY_32_EPSILON / EPSILON)) * mod;
	var result = a - (a - mod);
	if (result > BINARY_32_MAX_VALUE || isNaN(result)) {
		return s * Infinity;
	}
	return s * result;
};
