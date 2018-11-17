import axios, { AxiosInstance } from 'axios';
import config from 'config';

export interface IAPIConfig {
	host: string;
	port: number;
	base: string;
	resources: Record<string, string>;
}

export class APIServerClass {
	public readonly url: string;
	public readonly api: AxiosInstance;
	public readonly resources: Record<string, string>;

	constructor(apiConf: IAPIConfig = config.api.apiserver) {
		this.url = `${apiConf.host}${apiConf.port ? (':' + apiConf.port) : ''}${apiConf.base}`;
		this.resources = apiConf.resources;
		this.api = axios.create({
			baseURL: this.url,
			timeout: config.api.timeout
		});
	}
}
