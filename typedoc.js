module.exports = {
  out: './typedocs',

  // readme: 'none',
  // includes: './src',
  exclude: [
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
  theme: 'minimal'
};