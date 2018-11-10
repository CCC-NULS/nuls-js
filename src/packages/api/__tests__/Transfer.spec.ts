describe('transfer', () =>
{
	beforeEach(() =>
	{
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('send a transaction', async () =>
	{
		const { Transfer } = require('@/index');

		const transfer = new Transfer();

		transfer.send('asdf');
	});
});
