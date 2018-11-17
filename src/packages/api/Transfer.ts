import { APIServerClass } from './APIServer';

export class Transfer extends APIServerClass
{
	public send(asset: string, toAddress: string, amount: number)
	{
		console.log(asset, toAddress, amount);
	}
}
