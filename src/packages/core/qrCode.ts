import * as PkgQRCode from 'qrcode';
import importedNulsLogo from '@/assets/nulsLogo.png';
import importedNulsLogoBlack from '@/assets/nulsLogo-black.png';

const jimp = require('jimp');

export enum LogoColour {
  green = 'green',
  black = 'black'
}

export interface IAddressParams
{
  amount?: number;
}

export interface IQROptions
{
  logo: LogoColour | boolean;
}

const defaultIQROptions = {
  logo: LogoColour.green
};

class QRCodeClass {

  /**
	 * @param addressOrPrivateKey This can be either an address or a private key. Developers who read the QRCode should be able to read the QR code and if it's an `address` they can provide options for adding the contact or send funds, if it's a private key then the can transfer the funds, save or open the account.
	 * @param addressParams Extra URL parameters added onto the address URL QR code
	 * @param options Options for the QRCode
	 * @param QRCodeOptions Extra QRCode package options
	 */
  public async create(addressOrPrivateKey: string, addressParams: IAddressParams = {}, options: IQROptions = defaultIQROptions, QRCodeOptions: any = {}): Promise<void> {

    options = { ...defaultIQROptions, ...options };

    const urlObj = new URL(`nuls:${addressOrPrivateKey}`);

    Object.keys(addressParams).forEach((key) => {

      urlObj.searchParams.set(key, addressParams[key]);

    });

    try {

      const QRBuffer = await PkgQRCode.toDataURL(urlObj.href, { errorCorrectionLevel: 'H', ...QRCodeOptions });
      let nulsLogo;

      switch(options.logo) {

        case 'green':
			  nulsLogo = importedNulsLogo;
          break;

        case 'black':
			  nulsLogo = importedNulsLogoBlack;
          break;

        case false:
          break;

        default:
          throw new Error(`Unknown NULS logo colour [${options.logo}]`);

      }

      if (options.logo) {

        const QRImage = await jimp.read(Buffer.from(QRBuffer.replace('data:image/png;base64,', ''), 'base64'));
        const NULSImage = await jimp.read(nulsLogo);

        QRImage.composite(
          NULSImage,
          QRImage.bitmap.width / 2 - NULSImage.bitmap.width / 2,
          QRImage.bitmap.height / 2 - NULSImage.bitmap.height / 2,
        );

        return QRImage.getBase64Async('image/png');

      }

      return QRBuffer;

    } catch (err) {

      throw new Error(err.message);

    }

  }

}

export const QRCode = new QRCodeClass();
