import { NewAccount } from '@/packages/core/account/NewAccount';

export class Account extends NewAccount
{
	constructor(privateKey?: string, addressType: number = 1, chainId: number = 8964)
	{
		super(privateKey, addressType, chainId);
	}
}
