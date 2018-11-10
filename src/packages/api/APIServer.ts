import axios, { AxiosInstance } from 'axios';

export const APIServer = 'https://apiserver.nuls.io/nuls';

export const APIServerTestNet = 'http://testnet.apiserver.nuls.io/nuls';

export class APIServerClass
{
	public readonly url: string;
	public readonly api: AxiosInstance;

	constructor(url: string = APIServer)
	{
		this.url = url.substr(-1) === '/' ? url.substr(0, url.length - 1) : url; // Remove trailing slash
		this.api = axios.create({
			baseURL: this.url,
			timeout: 5000
		});
	}
}
