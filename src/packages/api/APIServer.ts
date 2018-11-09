import axios, { AxiosInstance } from 'axios';

export const APIServer = 'https://apiserver.nuls.io/';

export const APIServerTestNet = 'http://testnet.apiserver.nuls.io/';

export class APIServerClass
{
	public readonly url: string;
	public readonly api: AxiosInstance;

	constructor(url: string = APIServer)
	{
		this.url = url;
		this.api = axios.create({
			baseURL: this.url,
			timeout: 5000
		});
	}
}
