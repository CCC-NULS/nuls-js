import { Hash, Address } from './../utils/crypto';
import * as config from 'config';
import { APIServerClass, IAPIConfig } from './APIServer';
import { TransactionHash } from '../protocol/transaction/baseTransaction';

export interface ApiTransaction {
	hash: string;
	type: number;
	blockHeight: number;
	time: number;
	remark: string;
	txData: any;
	signature: string;
	inputs: Array<{
		value: number;
		lockTime: number;
		fromHash: Hash;
		fromIndex: number;
		address: Address
	}>;
	outputs: Array<{
		value: number;
		lockTime: number;
		address: Address;
	}>;
}

export class TransactionApi extends APIServerClass {

	constructor(conf: IAPIConfig = config.nuls.api.explorer) {
		super({ ...config.nuls.api.explorer, ...conf });
	}

	async broadcast(txHex: string): Promise<TransactionHash> {

		const resource: string = this.getResource('broadcast');

		try {

			return (await this.api.post(resource, { txHex })).data.value;

		} catch (e) {

			throw this.handleErrors(e);

		}

	}

	async transaction(hash: string): Promise<ApiTransaction> {

		const resource: string = this.getResource('transaction', hash);

		try {

			return (await this.api.get(resource)).data;

		} catch (e) {

			throw this.handleErrors(e);

		}

	}

	// TODO: Review if we are going to use this
	// async getBalance(address: string): Promise<any> {
	// 	const res = await this.api.get(`/balance/get/${address}`);

	// 	return res;
	// }

	// async getLatestBlock(): Promise<any> {
	// 	const res = await this.api.get('/block/newest');

	// 	return res;
	// }

	// async getTransaction(hash: string): Promise<any> {
	// 	const res = await this.api.get(`/tx/hash/${hash}`);

	// 	return res;
	// }
}
