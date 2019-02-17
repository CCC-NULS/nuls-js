import axios, { AxiosInstance, AxiosError } from 'axios';
import * as config from 'config';

export interface IAPIConfig {
	host: string;
	base?: string;
	resources?: Record<string, string>;
}

export class APIServerClass {
	public readonly url: string;
	public readonly api: AxiosInstance;
	public readonly resources?: Record<string, string>;

	constructor(apiConf: IAPIConfig = config.nuls.api.explorer) {
		this.url = `${apiConf.host}${apiConf.base || ''}`;
		this.resources = apiConf.resources;
		this.api = axios.create({
			baseURL: this.url,
			timeout: config.nuls.api.timeout
		});
	}

	protected getResource(name: string, ...args: string[]) {

		if (!this.resources || !this.resources[name]) {
			throw new Error(`The api resource "${name}" does not exists in the config`);
		}

		let resource = this.resources[name];

		args.forEach((arg: string) => {

			resource = resource.replace(/__([a-zA-Z0-9_]+?)__/, arg);

		});

		return resource;

	}

	protected handleErrors(e: AxiosError): AxiosError {

		if (e.response && e.response.data) {
			e.message = `${e.response.data.message}${e.response.data.extendedMessage ? (' - ' + e.response.data.extendedMessage) : ''}`;
		}

		return e;

	}

}
