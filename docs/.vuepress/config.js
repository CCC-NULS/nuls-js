module.exports = {
	base: '/nuls-js/',
	title: 'NULS JS',
	themeConfig: {
		repo: 'CCC-NULS/nuls-js',
		docsDir: 'docs',
		editLinks: true,
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Guide', link: '/guide/' },
			{ text: 'API Reference', link: 'https://CCC-NULS.github.io/nuls-js/typedoc/index.html' }
		],
		sidebar: [
			['/guide/', 'Getting Started'],
			{
				title: 'Account',
				collapsable: true,
				children: [
					'/guide/account/',
					'/guide/account/qr-code',
				]
			},
			// ['/guide/transaction/', 'Transaction'],
			{
				title: 'Transaction',
				collapsable: true,
				children: [
					['/guide/transaction/', 'Basic concepts'],
					'/guide/transaction/transfer',
					'/guide/transaction/alias',
				]
			},
			{
				title: 'Smart Contracts',
				collapsable: true,
				children: [
					'/guide/smart-contract/',
				]
			},
		]
	}
};
