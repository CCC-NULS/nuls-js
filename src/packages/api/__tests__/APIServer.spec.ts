describe('APIServer', () =>
{
	beforeEach(() =>
	{
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('the api server is optional and has our default value', async () =>
	{
		const { APIServerClass, APIServer, APIServerTestNet } = require('@/index');

		const APIDefault = new APIServerClass();
		const APILive = new APIServerClass(APIServer);
		const APITest = new APIServerClass(APIServerTestNet);

		expect(APIDefault.url).toEqual('https://apiserver.nuls.io/');
		expect(APILive.url).toEqual('https://apiserver.nuls.io/');
		expect(APITest.url).toEqual('http://testnet.apiserver.nuls.io/');
	});
});
