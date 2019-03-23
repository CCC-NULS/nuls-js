import * as PkgQRCode from 'qrcode';
import { QRCode, LogoColour } from '../index';

const jimp = require('jimp');

jest.mock('jimp');

describe('creating QR codes', () => {

  beforeEach(() => {

    jest.resetModules();
    jest.clearAllMocks();

  });

  test('an address', async () => {

    const code = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6');

    expect(jimp.read.mock.calls).toMatchSnapshot();
    expect(jimp.read().composite.mock.calls).toMatchSnapshot();
    expect(PkgQRCode.toDataURL.mock.calls).toMatchSnapshot();
    expect(code).toEqual('baz');

  });

  test('an address with an amount', async () => {

    const code = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', { amount: 10 });

    expect(jimp.read.mock.calls).toMatchSnapshot();
    expect(jimp.read().composite.mock.calls).toMatchSnapshot();
    expect(PkgQRCode.toDataURL.mock.calls).toMatchSnapshot();
    expect(code).toEqual('baz');

  });

  test('private ket import', async () => {

    const code = await QRCode.create('5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e');

    expect(jimp.read.mock.calls).toMatchSnapshot();
    expect(jimp.read().composite.mock.calls).toMatchSnapshot();
    expect(PkgQRCode.toDataURL.mock.calls).toMatchSnapshot();
    expect(code).toEqual('baz');

  });

  test('error correction level option setting `L`', async () => {

    const code = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, undefined, { errorCorrectionLevel: 'L' });

    expect(jimp.read.mock.calls).toMatchSnapshot();
    expect(jimp.read().composite.mock.calls).toMatchSnapshot();
    expect(PkgQRCode.toDataURL.mock.calls).toMatchSnapshot();
    expect(code).toEqual('baz');

  });

  test('logo colours', async () => {

    const green = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6');
    const white = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: LogoColour.green });
    const black = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: LogoColour.black });
    const blank = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: false });

    expect(jimp.read.mock.calls).toMatchSnapshot();
    expect(jimp.read().composite.mock.calls).toMatchSnapshot();
    expect(PkgQRCode.toDataURL.mock.calls).toMatchSnapshot();
    expect(green).toEqual('baz');
    expect(white).toEqual('baz');
    expect(black).toEqual('baz');
    expect(blank).toEqual('foo');

  });

  test('unknown logo colour', async () => {

    let errorMessage = 'No error thrown.';

    try {

      await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: 'foo' as any });

    } catch (error) {

      errorMessage = error.message;

    }

    expect(errorMessage).toBe('Unknown NULS logo colour [foo]');

  });

//   test('throw error', async () => {

//     let errorMessage = 'No error thrown.';

//     PkgQRCode.toDataURL = jest.fn(() => {

//       throw new Error('Error message');

// 	});


//     try {

// 		await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', { amount: 10 });

//     } catch (error) {

//       errorMessage = error.message;

// 	}

//     expect(errorMessage).toBe('Error message');

//   });

});
