describe.only('transactions', () =>
{
	beforeEach(() =>
	{
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('the api server is optional and has our default value', async () =>
	{
		const { Transfer } = require('@/index');

		const transfer = new Transfer();
		const transferCustomUrl = new Transfer('FooBar');

		expect(transfer.url).toEqual('https://apiserver.nuls.io/');
		expect(transferCustomUrl.url).toEqual('FooBar');
	});
});
