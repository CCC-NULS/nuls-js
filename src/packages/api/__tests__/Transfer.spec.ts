describe('transfer', () =>
{
	beforeEach(() =>
	{
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('the api server is optional and has our default value', async () =>
	{
		const { Transfer, APIServer, APIServerTestNet } = require('@/index');

		const transferDefault = new Transfer();
		const transferLive = new Transfer(APIServer);
		const transferTest = new Transfer(APIServerTestNet);

		expect(transferDefault.url).toEqual('https://apiserver.nuls.io/');
		expect(transferLive.url).toEqual('https://apiserver.nuls.io/');
		expect(transferTest.url).toEqual('http://testnet.apiserver.nuls.io/');
	});

	test('send a transaction', async () =>
	{
		const { Transfer } = require('@/index');

		const transfer = new Transfer();

		transfer.send('asdf');
	});
});
