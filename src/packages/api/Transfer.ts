import { APIServer } from '@/index';

export class Transfer
{
	public readonly url: string;

	constructor(url: string = APIServer)
	{
		this.url = url;
	}
}
