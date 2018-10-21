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
			{ text: 'Documentation', link: '/typedoc/' }
		],
			sidebar: {
			'/guide/': [
				'',
				'newAccount'
			]
		}
	}
};
