module.exports = {
	out: './typedocs',
	exclude: [
		'**/__tests__/**/*',
		'**/__mocks__/**/*',
		'**/node_modules/**/*'
	],
	includes: './docs',
	mode: 'file',
	excludeExternals: true,
	excludeNotExported: true,
	excludePrivate: true,
	ignoreCompilerErrors: true,
	theme: 'minimal'
};
