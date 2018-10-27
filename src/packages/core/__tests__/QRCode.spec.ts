describe('creating QR codes', () =>
{
	beforeEach(() =>
	{
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('an address', async () =>
	{
		const { QRCode } = require('@/index');
		const code = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6');

		expect(code).toMatchSnapshot();
	});

	test('an address with an amount', async () =>
	{
		const { QRCode } = require('@/index');
		const code = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', { amount: 10 });

		expect(code).toMatchSnapshot();
	});

	test('private ket import', async () =>
	{
		const { QRCode } = require('@/index');
		const code = await QRCode.create('5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e');

		expect(code).toMatchSnapshot();
	});

	test('error correction level option setting `L`', async () =>
	{
		const { QRCode } = require('@/index');
		const code = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, undefined, { errorCorrectionLevel: 'L' });

		expect(code).toMatchSnapshot();
	});

	test('logo colours', async () =>
	{
		const { QRCode } = require('@/index');
		const green = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6');
		const white = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: 'green' });
		const black = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: 'black' });
		const blank = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: false });

		expect(green).toMatchSnapshot();
		expect(white).toMatchSnapshot();
		expect(black).toMatchSnapshot();
		expect(blank).toMatchSnapshot();
	});

	test('unknown logo colour', async () =>
	{
		const { QRCode } = require('@/index');
		let errorMessage = 'No error thrown.';

		try
		{
			await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: 'foo' });
		}
		catch(error)
		{
			errorMessage = error.message;
		}

		expect(errorMessage).toBe('Unknown NULS logo colour [foo]');
	});

	test('throw error', async () =>
	{
		const PkgQRCode = require('qrcode');
		let errorMessage = 'No error thrown.';

		PkgQRCode.toDataURL = jest.fn(() =>
		{
			throw new Error('Error message');
		});

		const { QRCode } = require('@/index');

		try
		{
			await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', { amount: 10 });
		}
		catch(error)
		{
			errorMessage = error.message;
		}

		expect(errorMessage).toBe('Error message');
	});
});
