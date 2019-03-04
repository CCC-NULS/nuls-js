module.exports = {
	out: 'docs/.vuepress/public/typedoc',

	// readme: 'none',
	// includes: './src',
	exclude: [
		'test',
		'**/__tests__/**/*',
		'**/__mocks__/**/*',
		'**/node_modules/**/*'
	],

	includes: './docs',
	// media: './docs/',
	mode: 'file',
	excludeExternals: true,
	excludeNotExported: true,
	excludePrivate: true,
	ignoreCompilerErrors: true,
	theme: 'minimal',

	target: 'ES6',
	module: 'commonjs',
	name: 'NULS JS - API Reference',
	hideGenerator: true
};
