import { APIServerClass } from '@/packages/api/APIServer';

export class Transactions extends APIServerClass
{
	public async getBalance(address)
	{
		const res = await this.api.get(`nuls/balance/get/${address}`);

		return res;
	}
}
