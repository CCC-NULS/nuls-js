import * as pkg_QRCode from 'qrcode';
import * as url from 'url';

export interface IQROptions
{
	amount?: number;
}

class QRCodeClass
{
	/**
	 * @param addressOrPrivateKey This can be either an address or a private key. Developers who read the QRCode should be able to read the QR code and if it's an `address` they can provide options for adding the contact or send funds, if it's a private key then the can transfer the funds, save or open the account.
	 * @param options Extra URL parameters added onto the address URL QR code
	 * @param QRCodeOptions Extra QRCode package options
	 */
	public async create(addressOrPrivateKey: string, options: IQROptions = {}, QRCodeOptions: any = {})
	{
		const urlObj = new url.URL(`nuls:${addressOrPrivateKey}`);

		Object.keys(options).forEach((key) =>
		{
			urlObj.searchParams.set(key, options[key]);
		});

		try
		{
			return pkg_QRCode.toDataURL(urlObj.href, { errorCorrectionLevel: 'H', ...QRCodeOptions });
		}
		catch(err)
		{
			throw new Error(err.message);
		}
	}
}

export const QRCode = new QRCodeClass();
