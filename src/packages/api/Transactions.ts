import { APIServerClass } from '@/packages/api/APIServer';

export class Transactions extends APIServerClass
{
	public async getBalance(address: string): Promise<any>
	{
		const res = await this.api.get(`/balance/get/${address}`);

		return res;
	}

	public async getLatestBlock(): Promise<any>
	{
		const res = await this.api.get('/block/newest');

		return res;
	}

	public async getTransaction(hash: string): Promise<any>
	{
		const res = await this.api.get(`/tx/hash/${hash}`);

		return res;
	}
}
