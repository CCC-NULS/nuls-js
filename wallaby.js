// http://localhost:51245

module.exports = (wallaby) =>
{
	'use strict';

	return {
		files: [
			'config/*',
			'src/**/*.*',
			'testConfigs/*-setup.*',
			'package.json',
			'tsconfig.json',
			{
				pattern: 'src/**/__tests__/*.spec.*',
				ignore: true
			}
		],
		filesWithNoCoverageCalculated: [
			'testConfigs/*-setup.*',
			'src/**/__mocks__/*'
		],
		tests: [
			'tests/**/*.spec.*',
			'src/**/__tests__/*.spec.*'
		],
		env: {
			type: 'node',
			runner: 'node'
		},
		debug: true,
		testFramework: 'jest',
		compilers: {
			'**/*.js': wallaby.compilers.babel(),
			'**/*.ts': wallaby.compilers.typeScript({ module: 'commonjs' })
		}
	};
};
