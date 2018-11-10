const { APIServerClass, APIServer, APIServerTestNet } = require('@/index');

describe('APIServer', () =>
{
	beforeEach(() =>
	{
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('the api server is optional and has our default value', () =>
	{
		const APIDefault = new APIServerClass();
		const APILive = new APIServerClass(APIServer);
		const APITest = new APIServerClass(APIServerTestNet);

		expect(APIDefault.url).toEqual('https://apiserver.nuls.io/nuls');
		expect(APILive.url).toEqual('https://apiserver.nuls.io/nuls');
		expect(APITest.url).toEqual('http://testnet.apiserver.nuls.io/nuls');
	});

	test('custom api urls', () =>
	{
		const foo = new APIServerClass('foo');
		const bar = new APIServerClass('bar/');

		expect(foo.url).toEqual('foo');
		expect(bar.url).toEqual('bar');
	});
});
