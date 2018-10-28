describe.only('creating QR codes', () =>
{
	beforeEach(() =>
	{
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('an address', async () =>
	{
		const { Transfer } = require('@/index');

		const transfer = new Transfer();

		expect(transfer.url).toEqual('https://apiserver.nuls.io/');
	});
});
