module.exports = {
	transform: {
		'^.+\\.js?$': 'babel-jest',
		'^.+\\.tsx?$': 'ts-jest'
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^__testConfigs/(.*)$': '<rootDir>/testConfigs/$1'
    },
    moduleNameMapper: {
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
        '\\.(css|less)$': '<rootDir>/src/__mocks__/fileMock.js'
    },
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverageFrom: [
		'src/**/*.ts',
		'!**/node_modules/**',
		'!**/*.d.ts'
	],
	testPathIgnorePatterns: [
		'./node_modules/',
		'./dist/',
		'./testConfigs/jest-setup.ts'
	],
	reporters: ['default'],
	coverageDirectory: 'testConfigs/reports/coverage',
	coverageReporters: [
		'cobertura',
		'lcov'
	],
	bail: true,
	coverageThreshold: {
		global: {
			functions: 50,
			lines: 50,
			statements: 50
		}
	},
	setupFiles: [
		'./testConfigs/jest-setup.ts'
	],
	coveragePathIgnorePatterns: ['.*\\.d\\.ts', '<rootDir>/node_modules/']
};
