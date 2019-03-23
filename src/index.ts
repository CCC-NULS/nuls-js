// https://github.com/Microsoft/TypeScript/pull/29262
// <reference path="./public-typings.d.ts" />
const packages = require('./packages');

export * from './packages';

export default{
  ...packages
};
