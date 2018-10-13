jest.mock('crypto');

const NULS = require('@/index');

describe('account package', () =>
{
	test('extending newAccount class', () =>
	{
		const account = new NULS.Account();

		expect(account.getAccount()).toEqual({
			address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
			privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
			publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
		});
	});
});
