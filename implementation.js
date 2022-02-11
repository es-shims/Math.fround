'use strict';

module.exports = function fround(x) {
	/*
	 * We use magic numbers to guarantee immediate values.
	 * We extensively document their value in accompanying comments.
	 */
	/* eslint-disable no-magic-numbers */

	// Apply ToNumber(x) without relying on any function
	var v = +x; /* eslint-disable-line no-implicit-coercion */

	var s = v < 0 ? -1 : 1; // 1 for NaN, +0 and -0
	var mod = s * v; // abs(v), or -0 if v is -0

	/*
	 * Overflow case.
	 *
	 * The magic number 3.4028235677973366e38 is the threshold from which fround
	 * causes an overflow, resulting in Infinity.
	 * This code path is also used when the input is already an Infinity.
	 */
	if (mod >= 3.4028235677973366e38) { // overflow-threshold
		return s * Infinity;
	}

	/*
	 * Normal form case.
	 *
	 * The magic number 1.1754943508222875e-38 is the threshold from which the
	 * result of fround is represented as a normal form in binary32.
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
	 * less than the overflow-threshold, and overflow-threshold × C does not
	 * overflow, so that computation can never cause an overflow.
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
	if (mod >= 1.1754943508222875e-38) { // normal-form-threshold
		var p = mod * 536870913; // 2**29 + 1
		return s * (p + (mod - p));
	}

	/*
	 * Subnormal form case.
	 *
	 * We round `mod` to the nearest multiple of the smallest positive binary32
	 * value (which we call `Min32`), breaking ties to an even multiple.
	 *
	 * We do this by leveraging the inherent loss of precision near the minimum
	 * positive `number` value (`Min64`): conceptually, we divide the value by
	 *   Min32 / Min64
	 * which will drop the excess precision, applying exactly the rounding
	 * strategy that we want. Then we multiply the value back by the same
	 * constant.
	 *
	 * However, `Min32 / Min64` is not representable as a finite `number`.
	 * Therefore, we instead use the *inverse* constant
	 *   Min64 / Min32
	 * and we first multiply by that constant, then divide by it.
	 *
	 * ---
	 *
	 * As an additional "hack", the input values NaN, +0 and -0 also fall in this
	 * code path. For them, this computation happens to be an identity, and is
	 * therefore correct as well.
	 */
	return s * ((mod * 3.5257702653609953e-279) / 3.5257702653609953e-279); // Min64 / Min32

	/* eslint-enable no-magic-numbers */
};
