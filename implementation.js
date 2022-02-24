'use strict';

var $Number = Number;

var BINARY_32_MIN_VALUE = 1.401298464324817e-45; // 2 ** -(126 + 23)
var BINARY_32_MIN_NORMAL = 1.1754943508222875e-38; // 2 ** -126
var BINARY_64_MIN_VALUE = 5e-324; // 2 ** -(1022 + 52)
var BINARY_64_32_MIN_VALUE_RATIO = BINARY_64_MIN_VALUE / BINARY_32_MIN_VALUE;

/*
 * The smallest input value that overflows when rounded through `fround`,
 * resulting in `Infinity`.
 * This is the midpoint between the maximum finite binary32 value and Infinity.
 * It can be computed in Java as
 * ((double) Float.MAX_VALUE) + (((double) Math.ulp(Float.MAX_VALUE)) / 2.0)
 */
var FROUND_OVERFLOW_THRESHOLD = 3.4028235677973366e+38;

// The `C` factor used in Veltkamp's splitting below.
var VELTKAMP_SPLITTING_C_FACTOR = 536870913; // 2**29 + 1

module.exports = function fround(x) {
	// Apply ToNumber(x)
	var v = $Number(x);

	var s = v < 0 ? -1 : 1; // 1 for NaN, +0 and -0
	var mod = s * v; // abs(v), or -0 if v is -0

	/*
	 * Overflow case.
	 */
	if (mod >= FROUND_OVERFLOW_THRESHOLD) {
		return s * Infinity;
	}

	/*
	 * Normal form case.
	 *
	 * Here, we know that both the input and output are expressed in a normal
	 * form as `number`s as well, so standard floating point algorithms from
	 * papers can be used.
	 *
	 * We use Veltkamp's splitting, as described and studied in
	 *   Sylvie Boldo.
	 *   Pitfalls of a Full Floating-Point Proof:
	 *   Example on the Formal Proof of the Veltkamp/Dekker Algorithms
	 *   https://dx.doi.org/10.1007/11814771_6
	 * Section 3, with β = 2, t = 53, s = 53 - 24 = 29, x = mod.
	 * 53 is the number of effective mantissa bits in a Double; 24 in a Float.
	 *
	 * ◦ is the round-to-nearest operation with a tie-breaking rule (in our case,
	 * ties-to-even).
	 *
	 *   Let C = βˢ + 1 = 536870913
	 *   p = ◦(x × C)
	 *   q = ◦(x − p)
	 *   x₁ = ◦(p + q)
	 *
	 * Boldo proves that x₁ is the (t-s)-bit float closest to x, using the same
	 * tie-breaking rule as ◦. Since (t-s) = 24, this is the closest binary32
	 * value (with 24 mantissa bits), and therefore the correct result of
	 * `fround`.
	 *
	 * Boldo also proves that if the computation of x × C does not overflow, then
	 * none of the following operations will overflow. We know that x (mod) is
	 * less than FROUND_OVERFLOW_THRESHOLD, and FROUND_OVERFLOW_THRESHOLD × C
	 * does not overflow, so that computation can never cause an overflow.
	 *
	 * If the reader does not have access to Boldo's paper, they may refer
	 * instead to
	 *   Claude-Pierre Jeannerod, Jean-Michel Muller, Paul Zimmermann.
	 *   On various ways to split a floating-point number.
	 *   ARITH 2018 - 25th IEEE Symposium on Computer Arithmetic,
	 *   Jun 2018, Amherst (MA), United States.
	 *   pp.53-60, 10.1109/ARITH.2018.8464793. hal-01774587v2
	 * available at
	 *   https://hal.inria.fr/hal-01774587v2/document
	 * Section III, although that paper defers some theorems and proofs to
	 * Boldo's.
	 */
	if (mod >= BINARY_32_MIN_NORMAL) {
		var p = mod * VELTKAMP_SPLITTING_C_FACTOR;
		return s * (p + (mod - p));
	}

	/*
	 * Subnormal form case.
	 *
	 * We round `mod` to the nearest multiple of the smallest positive binary32
	 * value (which we call `BINARY_32_MIN_VALUE`), breaking ties to an even
	 * multiple.
	 *
	 * We do this by leveraging the inherent loss of precision near the minimum
	 * positive `number` value (`BINARY_64_MIN_VALUE`): conceptually, we divide
	 * the value by
	 *   BINARY_32_MIN_VALUE / BINARY_64_MIN_VALUE
	 * which will drop the excess precision, applying exactly the rounding
	 * strategy that we want. Then we multiply the value back by the same
	 * constant.
	 *
	 * However, `BINARY_32_MIN_VALUE / BINARY_64_MIN_VALUE` is not representable
	 * as a finite `number`. Therefore, we instead use the *inverse* constant
	 *   BINARY_64_MIN_VALUE / BINARY_32_MIN_VALUE
	 * and we first multiply by that constant, then divide by it. We stored that
	 * constant as `BINARY_64_32_MIN_VALUE_RATIO`.
	 *
	 * ---
	 *
	 * As an additional "hack", the input values NaN, +0 and -0 also fall in this
	 * code path. For them, this computation happens to be an identity, and is
	 * therefore correct as well.
	 */
	return s * ((mod * BINARY_64_32_MIN_VALUE_RATIO) / BINARY_64_32_MIN_VALUE_RATIO);
};
