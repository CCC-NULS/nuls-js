import * as config from 'config';
import { APIServerClass, IAPIConfig } from './APIServer';
import { TransactionHash } from '../protocol/transaction/baseTransaction';

export class TransactionApi extends APIServerClass {

	constructor(conf: IAPIConfig = config.nuls.api.explorer) {
		super(conf);
	}

	async broadcast(txHex: string): Promise<TransactionHash> {

		const resource: string = this.getResource('broadcast');
		return (await this.api.post(resource, { txHex })).data.value;

	}

	// TODO: Review if we are going to use this
	async getBalance(address: string): Promise<any> {
		const res = await this.api.get(`/balance/get/${address}`);

		return res;
	}

	async getLatestBlock(): Promise<any> {
		const res = await this.api.get('/block/newest');

		return res;
	}

	async getTransaction(hash: string): Promise<any> {
		const res = await this.api.get(`/tx/hash/${hash}`);

		return res;
	}
}
