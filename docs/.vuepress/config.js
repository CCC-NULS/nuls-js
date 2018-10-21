module.exports = {
	base: '/nuls-js/',
		title: 'nuls-js',
		themeConfig: {
		repo: 'AlephNuls/nuls-js',
			docsDir: 'docs',
			editLinks: true,
			nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Guide', link: '/guide/' },
			{ text: 'Documentation', link: 'https://alephnuls.github.io/nuls-js/typedoc/index.html' }
		],
			sidebar: {
			'/guide/': [
				'',
				'newAccount'
			]
		}
	}
};
