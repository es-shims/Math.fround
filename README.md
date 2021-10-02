# Math.fround <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

An ESnext spec-compliant `Math.fround` shim/polyfill/replacement that works as far down as ES3.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the [spec](https://tc39.es/ecma262/#sec-map-objects).

## Getting started

```sh
npm install --save math.fround
```

## Usage/Examples

```js
console.log(Math.fround(1.5)); // 1.5
console.log(Math.fround(1.337)); // 1.3370000123977661
console.log(Math.fround(2 ** 150)); // Infinity
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/math.fround
[npm-version-svg]: https://versionbadg.es/es-shims/Math.fround.svg
[deps-svg]: https://david-dm.org/es-shims/Math.fround.svg
[deps-url]: https://david-dm.org/es-shims/Math.fround
[dev-deps-svg]: https://david-dm.org/es-shims/Math.fround/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Math.fround#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/math.fround.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/math.fround.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/math.fround.svg
[downloads-url]: https://npm-stat.com/charts.html?package=math.fround
[codecov-image]: https://codecov.io/gh/es-shims/Math.fround/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/es-shims/Math.fround/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/es-shims/Math.fround
[actions-url]: https://github.com/es-shims/Math.fround/actions
