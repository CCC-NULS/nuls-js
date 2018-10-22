import { QRCode } from '@/index';

describe('creating QR codes', () =>
{
	test('an address', async () =>
	{
		const code = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6');

		expect(code).toMatchSnapshot();
	});

	test('an address with an amount', async () =>
	{
		const code = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', { amount: 10 });

		expect(code).toMatchSnapshot();
	});
});
