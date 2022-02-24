'use strict';

module.exports = function (fround, t) {
	// Mozilla's reference tests: https://bug900125.bugzilla.mozilla.org/attachment.cgi?id=793163
	t.test('returns NaN for undefined', function (st) {
		st.equal(fround(), NaN, 'fround()');
		st.end();
	});

	t.test('returns NaN for NaN', function (st) {
		st.equal(fround(NaN), NaN, 'fround(NaN)');
		st.end();
	});

	t.test('works for zeroes and infinities', function (st) {
		st.equal(fround(0), +0, 'fround(0)');
		st.equal(fround({ valueOf: function () { return 0; } }), +0, 'fround({ valueOf: function () { return 0; } })');
		st.equal(fround(-0), -0, 'fround(-0)');
		st.equal(fround({ valueOf: function () { return -0; } }), -0, 'fround({ valueOf: function () { return -0; } })');
		st.equal(fround(Infinity), Infinity, 'fround(Infinity)');
		st.equal(fround({ valueOf: function () { return Infinity; } }), Infinity, 'fround({ valueOf: function () { return Infinity; } })');
		st.equal(fround(-Infinity), -Infinity, 'fround(-Infinity)');
		st.equal(fround({ valueOf: function () { return -Infinity; } }), -Infinity, 'fround({ valueOf: function () { return -Infinity; } })');
		st.end();
	});

	t.test('returns infinity for large numbers', function (st) {
		st.equal(fround(1.7976931348623157e+308), Infinity, 'fround(1.7976931348623157e+308)');
		st.equal(fround(-1.7976931348623157e+308), -Infinity, 'fround(-1.7976931348623157e+308)');
		st.equal(fround(3.4028235677973366e+38), Infinity, 'fround(3.4028235677973366e+38)');
		st.end();
	});

	t.test('returns zero for really small numbers', function (st) {
		st.equal(Number.MIN_VALUE, 5e-324, 'Number.MIN_VALUE');

		st.equal(fround(Number.MIN_VALUE), 0, 'fround(Number.MIN_VALUE)');
		st.equal(fround(-Number.MIN_VALUE), -0, 'fround(-Number.MIN_VALUE)');
		st.end();
	});

	t.test('rounds properly', function (st) {
		st.equal(fround(3), 3, 'fround(3)');
		st.equal(fround(-3), -3, 'fround(-3)');
		st.end();
	});

	t.test('rounds properly with the max float 32', function (st) {
		var maxFloat32 = 3.4028234663852886e+38;
		st.equal(fround(maxFloat32), maxFloat32, 'fround(maxFloat32)');
		st.equal(fround(-maxFloat32), -maxFloat32, 'fround(-maxFloat32)');

		var maxValueThatRoundsDownToMaxFloat32 = 3.4028235677973362e+38;
		st.equal(fround(maxValueThatRoundsDownToMaxFloat32), maxFloat32, 'fround(maxValueThatRoundsDownToMaxFloat32)');
		st.equal(fround(-maxValueThatRoundsDownToMaxFloat32), -maxFloat32, 'fround(-maxValueThatRoundsDownToMaxFloat32)');

		// round-nearest rounds down to maxFloat32
		st.equal(fround(maxFloat32 + Math.pow(2, Math.pow(2, 8 - 1) - 1 - 23 - 2)), maxFloat32, 'fround(maxFloat32 + pow(2, pow(2, 8 - 1) - 1 - 23 - 2))');
		st.end();
	});

	t.test('rounds properly with the min float 32', function (st) {
		var minFloat32 = 1.401298464324817e-45;
		st.equal(fround(minFloat32), minFloat32, 'fround(minFloat32)');
		st.equal(fround(-minFloat32), -minFloat32, 'fround(-minFloat32)');
		st.equal(fround(minFloat32 / 2), 0, 'fround(minFloat32 / 2)');
		st.equal(fround(-minFloat32 / 2), -0, 'fround(-minFloat32 / 2)');
		st.equal(fround((minFloat32 / 2) + Math.pow(2, -202)), minFloat32, 'fround((minFloat32 / 2) + pow(2, -202))');
		st.equal(fround((-minFloat32 / 2) - Math.pow(2, -202)), -minFloat32, 'fround((-minFloat32 / 2) - pow(2, -202))');
		st.end();
	});

	t.test('rounds properly with the subnormal-normal boundary', function (st) {
		var maxSubnormal32 = 1.1754942106924411e-38;
		var minNormal32 = 1.1754943508222875e-38;
		st.equal(fround(1.1754942807573642e-38), maxSubnormal32, 'fround(1.1754942807573642e-38)');
		st.equal(fround(1.1754942807573643e-38), minNormal32, 'fround(1.1754942807573643e-38)');
		st.equal(fround(1.1754942807573644e-38), minNormal32, 'fround(1.1754942807573644e-38)');
		st.equal(fround(-1.1754942807573642e-38), -maxSubnormal32, 'fround(-1.1754942807573642e-38)');
		st.equal(fround(-1.1754942807573643e-38), -minNormal32, 'fround(-1.1754942807573643e-38)');
		st.equal(fround(-1.1754942807573644e-38), -minNormal32, 'fround(-1.1754942807573644e-38)');
		st.end();
	});
};
