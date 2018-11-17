import axios, { AxiosInstance } from 'axios';
import config from 'config';

export interface IAPIConfig {
	host: string;
	port: number;
	base: string;
}

export class APIServerClass {
	public url: string;
	public readonly api: AxiosInstance;

	constructor(apiConf: IAPIConfig = config.api.apiserver) {
		this.url = `${apiConf.host}${apiConf.port ? (':' + apiConf.port) : ''}${apiConf.base}`;
		this.api = axios.create({
			baseURL: this.url,
			timeout: config.api.timeout
		});
	}
}
