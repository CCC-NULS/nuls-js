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
			['/guide/block/', 'Block'],
			{
				title: 'Transaction',
				collapsable: true,
				children: [
					['/guide/transaction/', 'Basic concepts'],
					'/guide/transaction/transaction-model',
					'/guide/transaction/transfer',
					'/guide/transaction/alias',
					'/guide/transaction/register',
					'/guide/transaction/deposit',
					'/guide/transaction/withdraw',
					'/guide/transaction/data',
					'/guide/transaction/contract-call',
				]
			},
			{
				title: 'Smart Contracts',
				collapsable: true,
				children: [
					'/guide/smart-contract/',
					'/guide/smart-contract/view-method',
					'/guide/smart-contract/payable-method'
				]
			},
		]
	}
};
