
module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(tsx?)$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!**/node_modules/**",
        "!**/*.d.ts"
    ],
    testPathIgnorePatterns: [
        "./node_modules/",
        "./dist/",
        "./tests/jest-setup.ts"
    ],
    reporters: [ "default" ],
    coverageDirectory: 'tests/reports/coverage',
    coverageReporters: [
        "cobertura",
        "lcov"
    ],
    bail: true,
    coverageThreshold: {
      global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
      }
    },
    setupFiles: [
        './tests/jest-setup.ts'
    ],
};
