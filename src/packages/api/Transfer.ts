import { APIServer } from '@/index';

export class Transfer
{
	public readonly url: string;

	constructor(url?: string)
	{
		this.url = url || APIServer;

		console.log(this.url);
	}
}
