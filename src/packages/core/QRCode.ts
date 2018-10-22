import * as pkg_QRCode from 'qrcode';
import * as url from 'url';

interface IQROptions
{
	amount?: number;
}

class QRCodeClass
{
	public test()
	{
		return 'hello';
	}

	public async create(address: string, options: any = {})
	{
		return this.generateQR(address, options);
	}

	private async generateQR(address: string, options: IQROptions = {}, QRCodeOptions: any = {})
	{
		const urlObj = new url.URL(`nuls:${address}`);

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
