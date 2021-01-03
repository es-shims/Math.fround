import fround, * as froundModule from 'math.fround';
import test from 'tape';
import runTests from './tests.js';

test('as a function', (t) => {
	runTests(fround, t);

	t.end();
});

test('named exports', async (t) => {
	t.deepEqual(
		Object.keys(froundModule).sort(),
		['default', 'shim', 'getPolyfill', 'implementation'].sort(),
		'has expected named exports',
	);

	const { shim, getPolyfill, implementation } = froundModule;
	t.equal(await import('math.fround/shim'), shim, 'shim named export matches deep export');
	t.equal(await import('math.fround/implementation'), implementation, 'implementation named export matches deep export');
	t.equal(await import('math.fround/polyfill'), getPolyfill, 'getPolyfill named export matches deep export');

	t.end();
});
